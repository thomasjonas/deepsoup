import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { count, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get video statistics
		const totalVideos = await db.select({ count: count() }).from(videos);

		const recentVideos = await db
			.select({
				id: videos.id,
				title: videos.title,
				userName: videos.userName,
				uploadDate: videos.uploadDate,
				status: videos.status,
				duration: videos.duration,
				fileSize: videos.fileSize
			})
			.from(videos)
			.orderBy(sql`${videos.uploadDate} DESC`)
			.limit(10);

		// Calculate total file size
		const totalSizeResult = await db
			.select({
				totalSize: sql<number>`SUM(${videos.fileSize})`
			})
			.from(videos);

		const totalSize = totalSizeResult[0]?.totalSize || 0;

		return {
			stats: {
				totalVideos: totalVideos[0]?.count || 0,
				totalSize: Math.round(totalSize / (1024 * 1024)) // Convert to MB
			},
			recentVideos: recentVideos.map((video) => ({
				...video,
				uploadDate: video.uploadDate?.toISOString() || null,
				fileSizeMB: video.fileSize ? Math.round(video.fileSize / (1024 * 1024)) : 0,
				durationFormatted: video.duration
					? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`
					: null
			}))
		};
	} catch (error) {
		console.error('Error loading admin dashboard:', error);
		return {
			stats: {
				totalVideos: 0,
				totalSize: 0
			},
			recentVideos: []
		};
	}
};
