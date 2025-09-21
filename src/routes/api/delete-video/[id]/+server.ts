import { eq } from 'drizzle-orm';
import { BUNNY_LIBRARY_ID } from '$env/static/private';
import { deleteVideo, getVideoInfo } from '$lib/server/bunny-stream';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, params }) => {
	const { id } = params;

	try {
		const existing = await db
			.select()
			.from(videos)
			.where(eq(videos.id, parseInt(id)));

		if (existing.length !== 1)
			return json({
				success: false,
				message: 'No video found',
				status: 400
			});

		const video = existing.pop()!;
		if (video?.bunnyVideoId) await deleteVideo(video.bunnyVideoId);
		await db.delete(videos).where(eq(videos.id, parseInt(id)));

		return json({
			success: true,
			message: 'Video successfully deleted',
			videoId: video.id,
			bunnyId: video?.bunnyVideoId
		});
	} catch (dbError) {
		console.error('Database error while delete video:', dbError);

		// Try to clean up BunnyStream video if database insert fails
		// Note: We could implement deleteVideo call here, but for now just log the issue

		return json(
			{
				success: false,
				error: 'Failed to delete video.'
			},
			{ status: 500 }
		);
	}
};
