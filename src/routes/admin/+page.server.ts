// import { getAllVideos } from '$lib/server/db/videos';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// const videos = await getAllVideos();
		const videos: any[] = [];

		return {
			stats: {
				totalVideos: videos.length
			},
			videos
		};
	} catch (error) {
		console.error('Error loading admin dashboard:', error);
		return {
			stats: {
				totalVideos: 0
			},
			videos: []
		};
	}
};
