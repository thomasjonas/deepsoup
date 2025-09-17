import { PUBLIC_BUNNY_STORAGE_ZONE_NAME } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, fetch, locals }) => {
	const { videoId } = params;
	const filename = url.searchParams.get('filename');

	if (!videoId) {
		return new Response('Missing videoId', { status: 400 });
	}
	if (!filename) {
		return new Response('Missing filename parameter', { status: 400 });
	}

	// Replace with your env var (exposed in SvelteKit config)

	const bunnyUrl = `https://${PUBLIC_BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/${videoId}/original`;

	// Fetch the file from Bunny CDN
	const response = await fetch(bunnyUrl);

	if (!response.ok) {
		return new Response('Failed to fetch from Bunny', { status: response.status });
	}

	// Clone headers but override Content-Disposition
	const newHeaders = new Headers(response.headers);
	newHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);

	return new Response(response.body, {
		status: response.status,
		headers: newHeaders
	});
};
