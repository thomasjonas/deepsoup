import { db } from '$lib/server/db';
import { siteContent } from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
	// Get existing content
	const existingContent = await db.select().from(siteContent);

	// Convert to a more usable format
	const contentMap: Record<string, string> = {};

	existingContent.forEach((item) => {
		contentMap[item.key] = item.content;
	});

	return {
		...contentMap
	};
};
