import { BUNNY_LIBRARY_ID } from '$env/static/private';
import { getVideoInfo } from '$lib/server/bunny-stream';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract form fields
		const videoId = formData.get('videoId') as string;
		const videoFileName = formData.get('videoFileName') as string;
		const videoFileSize = formData.get('videoFileSize') as string;
		const videoDuration = formData.get('videoDuration') as string;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const instagramHandle = formData.get('instagramHandle') as string;
		const aiDescription = formData.get('aiDescription') as string;

		const video = await getVideoInfo(videoId);

		// Validate required fields
		if (!video || !name || !email) {
			return json(
				{
					success: false,
					error: 'Missing required fields: video file, name, or email'
				},
				{ status: 400 }
			);
		}

		const videoUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}`;
		const embedUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=true&preload=true`;

		// Save video metadata to database
		console.log('Saving video metadata to database...');
		try {
			const insertResult = await db
				.insert(videos)
				.values({
					bunnyVideoId: video.guid,
					originalFilename: videoFileName,
					title: videoFileName,
					aiDescription: aiDescription,
					duration: videoDuration ? parseFloat(videoDuration) : null,
					fileSize: videoFileSize ? parseInt(videoFileSize, 10) : null,
					userName: name,
					userEmail: email,
					instagramHandle: instagramHandle || null,
					uploadDate: new Date(),
					bunnyStreamUrl: embedUrl || null,
					downloadUrl: videoUrl || null
				})
				.returning({ id: videos.id });

			const recordID = insertResult[0]?.id;

			console.log('Video submission completed successfully:', {
				recordID,
				bunnyVideoId: video.guid,
				title: videoFileName
			});

			return json({
				success: true,
				message: 'Video submitted successfully',
				recordID,
				bunnyVideoId: video.guid
			});
		} catch (dbError) {
			console.error('Database error while saving video:', dbError);

			// Try to clean up BunnyStream video if database insert fails
			// Note: We could implement deleteVideo call here, but for now just log the issue

			return json(
				{
					success: false,
					error: 'Failed to save video information. Please contact support.'
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Error in upload-video API:', error);

		return json(
			{
				success: false,
				error: 'Internal server error during upload'
			},
			{ status: 500 }
		);
	}
};
