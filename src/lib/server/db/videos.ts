import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function getAllVideos() {
	const allVideos = await db
		.select()
		.from(videos)
		.orderBy(sql`${videos.uploadDate} DESC`);

	return allVideos.map((video) => ({
		...video,
		uploadDate: video.uploadDate,
		fileSizeMB: video.fileSize ? Math.round(video.fileSize / (1024 * 1024)) : 0,
		durationFormatted: video.duration
			? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`
			: null
	}));
}
