import type { RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';
import { BUNNY_API_KEY, BUNNY_LIBRARY_ID } from '$env/static/private';
import { createVideo } from '$lib/server/bunny-stream';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	// e.g. { filename, filetype, maybe collection etc. }

	const videoCreated = await createVideo(body.filename);
	console.log({ videoCreated });
	// createBunnyVideo calls Bunny’s REST API “Create Video” to get a videoId etc.
	const videoId = videoCreated.guid;

	const expireSeconds = Math.floor(Date.now() / 1000) + 60 * 60; // e.g. 1 hour
	const signatureData = BUNNY_LIBRARY_ID + BUNNY_API_KEY + expireSeconds + videoId;
	const signature = crypto.createHash('sha256').update(signatureData).digest('hex');

	return new Response(
		JSON.stringify({
			libraryId: BUNNY_LIBRARY_ID,
			videoId,
			signature,
			expires: expireSeconds
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
};
