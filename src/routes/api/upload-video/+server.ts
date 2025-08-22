import { json } from '@sveltejs/kit';
import { createVideo, uploadVideo } from '$lib/server/bunny-stream';
import { generateFallbackDescription } from '$lib/server/openai';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract form fields
		const videoFile = formData.get('video') as File;
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const instagramHandle = formData.get('instagramHandle') as string;
		const aiTitle = formData.get('aiTitle') as string;
		const aiDescription = formData.get('aiDescription') as string;
		const duration = parseFloat(formData.get('duration') as string);
		const fileSize = parseInt(formData.get('fileSize') as string);

		// Validate required fields
		if (!videoFile || !name || !email) {
			return json(
				{
					success: false,
					error: 'Missing required fields: video file, name, or email'
				},
				{ status: 400 }
			);
		}

		// Validate file type
		if (!videoFile.type.startsWith('video/')) {
			return json(
				{
					success: false,
					error: 'Invalid file type. Please upload a video file.'
				},
				{ status: 400 }
			);
		}

		// Validate file size (300MB limit)
		if (videoFile.size > 300 * 1024 * 1024) {
			return json(
				{
					success: false,
					error: 'File size too large. Maximum size is 300MB.'
				},
				{ status: 400 }
			);
		}

		// Generate title and description fallbacks if AI analysis failed
		let finalTitle = aiTitle;
		let finalDescription = aiDescription;

		if (!finalTitle || !finalDescription) {
			const fallback = generateFallbackDescription(videoFile.name);
			if (!finalTitle) finalTitle = fallback.title || 'Untitled Video';
			if (!finalDescription) finalDescription = fallback.description || 'Video upload';
		}

		// Create video entry in BunnyStream
		console.log('Creating video in BunnyStream...');
		const createResult = await createVideo(finalTitle);

		if (!createResult.success || !createResult.guid) {
			console.error('Failed to create video in BunnyStream:', createResult.message);
			return json(
				{
					success: false,
					error: 'Failed to initialize video upload. Please try again.'
				},
				{ status: 500 }
			);
		}

		// Convert file to buffer for upload
		const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

		// Upload video file to BunnyStream
		console.log('Uploading video file to BunnyStream...');
		const uploadResult = await uploadVideo(createResult.guid, videoBuffer, videoFile.name);

		if (!uploadResult.success) {
			console.error('Failed to upload video to BunnyStream:', uploadResult.message);
			return json(
				{
					success: false,
					error: 'Failed to upload video. Please try again.'
				},
				{ status: 500 }
			);
		}

		// Save video metadata to database
		console.log('Saving video metadata to database...');
		try {
			const insertResult = await db
				.insert(videos)
				.values({
					bunnyVideoId: createResult.guid,
					originalFilename: videoFile.name,
					title: finalTitle,
					aiDescription: finalDescription,
					duration: duration || null,
					fileSize: fileSize || videoFile.size,
					userName: name,
					userEmail: email,
					instagramHandle: instagramHandle || null,
					uploadDate: new Date(),
					status: 'processing',
					bunnyStreamUrl: uploadResult.embedUrl || null,
					downloadUrl: uploadResult.videoUrl || null
				})
				.returning({ id: videos.id });

			const videoId = insertResult[0]?.id;

			console.log('Video upload completed successfully:', {
				videoId,
				bunnyVideoId: createResult.guid,
				title: finalTitle
			});

			return json({
				success: true,
				message: 'Video uploaded successfully',
				videoId,
				bunnyVideoId: createResult.guid
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
