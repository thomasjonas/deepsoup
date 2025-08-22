import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all videos with full details
		const allVideos = await db
			.select({
				id: videos.id,
				bunnyVideoId: videos.bunnyVideoId,
				originalFilename: videos.originalFilename,
				title: videos.title,
				aiDescription: videos.aiDescription,
				duration: videos.duration,
				fileSize: videos.fileSize,
				userName: videos.userName,
				userEmail: videos.userEmail,
				instagramHandle: videos.instagramHandle,
				uploadDate: videos.uploadDate,
				status: videos.status,
				bunnyStreamUrl: videos.bunnyStreamUrl,
				downloadUrl: videos.downloadUrl
			})
			.from(videos)
			.orderBy(sql`${videos.uploadDate} DESC`);

		return {
			videos: allVideos.map((video) => ({
				...video,
				uploadDate: video.uploadDate?.toISOString() || null,
				fileSizeMB: video.fileSize ? Math.round(video.fileSize / (1024 * 1024)) : 0,
				durationFormatted: video.duration
					? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`
					: null
			}))
		};
	} catch (error) {
		console.error('Error loading videos:', error);
		return {
			videos: []
		};
	}
};
