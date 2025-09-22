import { db } from '$lib/server/db';
import { siteContent } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get existing content
		const existingContent = await db.select().from(siteContent);

		// Convert to a more usable format
		const contentMap: Record<string, { content: string; updatedAt: string | null }> = {};

		existingContent.forEach((item) => {
			contentMap[item.key] = {
				content: item.content,
				updatedAt: item.updatedAt?.toISOString() || null
			};
		});

		// Ensure we have default entries for our expected keys
		const defaultContent = {
			colophon: {
				content:
					contentMap.colophon?.content ||
					'Welcome to our video platform. This space can be used for credits, acknowledgments, or any other information about your project.',
				updatedAt: contentMap.colophon?.updatedAt || null
			},
			screening_dates: {
				content:
					contentMap.screening_dates?.content ||
					'Screening dates will be announced soon. Please check back regularly for updates.',
				updatedAt: contentMap.screening_dates?.updatedAt || null
			},
			prompt: {
				content: contentMap.prompt?.content || 'Prompt goes here',
				updatedAt: contentMap.prompt?.updatedAt || null
			},
			topbar: {
				content: contentMap.topbar?.content || 'Title ticker content goes here',
				updatedAt: contentMap.topbar?.updatedAt || null
			}
		};

		return {
			content: defaultContent
		};
	} catch (error) {
		console.error('Error loading content:', error);
		return {
			content: {
				colophon: {
					content:
						'Welcome to our video platform. This space can be used for credits, acknowledgments, or any other information about your project.',
					updatedAt: null
				},
				screening_dates: {
					content:
						'Screening dates will be announced soon. Please check back regularly for updates.',
					updatedAt: null
				},
				prompt: {
					content: 'Prompt goes here',
					updatedAt: null
				},
				topbar: {
					content: 'Title ticker content goes here',
					updatedAt: null
				}
			}
		};
	}
};

export const actions: Actions = {
	updateContent: async ({ request }) => {
		try {
			const formData = await request.formData();
			const key = formData.get('key') as string;
			const content = formData.get('content') as string;

			if (!key || !content) {
				return fail(400, { error: 'Missing key or content' });
			}

			// Validate key
			if (!['colophon', 'screening_dates', 'prompt', 'topbar'].includes(key)) {
				return fail(400, { error: 'Invalid content key' });
			}

			// Check if content already exists
			const existing = await db.select().from(siteContent).where(eq(siteContent.key, key));

			const now = new Date();

			if (existing.length > 0) {
				// Update existing content
				await db
					.update(siteContent)
					.set({
						content: content.trim(),
						updatedAt: now
					})
					.where(eq(siteContent.key, key));
			} else {
				// Insert new content
				await db.insert(siteContent).values({
					key,
					content: content.trim(),
					updatedAt: now
				});
			}

			return {
				success: true,
				message: 'Content updated successfully',
				content: content.trim()
			};
		} catch (error) {
			console.error('Error updating content:', error);
			return fail(500, { error: 'Failed to update content' });
		}
	}
};
