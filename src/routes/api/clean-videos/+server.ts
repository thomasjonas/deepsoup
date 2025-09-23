import { dev } from '$app/environment';
import { deleteVideo, listVideos } from '$lib/server/bunny-stream';
import { db } from '$lib/server/db';
import { videos } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const bunnyVideos = await listVideos();
	const bunnyVideoIds = bunnyVideos.map((v) => v.guid);

	const existing = await db.select().from(videos);
	const existingIds = existing.map((v) => v.bunnyVideoId);
	const toRemove = bunnyVideoIds.filter((id) => !existingIds.includes(id));

	if (dev) await Promise.all(toRemove.map(deleteVideo));

	return new Response(
		JSON.stringify({
			removed: toRemove.length
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
};
