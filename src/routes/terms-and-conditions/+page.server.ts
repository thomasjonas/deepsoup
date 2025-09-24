import { db } from '$lib/server/db';
import { siteContent } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	// Get existing content
	const existingContent = await db.select().from(siteContent).where(eq(siteContent.key, 'terms'));

	return {
		terms: existingContent.pop()?.content
	};
};
