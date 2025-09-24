import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { analyzeVideoScreenshots, generateFallbackDescription } from '$lib/server/openai';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { siteContent } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { screenshots, prompt: p } = await request.json();
		let prompt = p;
		if (!prompt) {
			const prompts =
				p ?? (await db.select().from(siteContent).where(eq(siteContent.key, 'prompt')));
			prompt = prompts.pop().content;
		}

		if (!prompt) {
			return json(
				{
					success: false,
					error: 'No prompt provided'
				},
				{ status: 400 }
			);
		}

		if (!screenshots || !Array.isArray(screenshots) || screenshots.length === 0) {
			return json(
				{
					success: false,
					error: 'No screenshots provided'
				},
				{ status: 400 }
			);
		}

		// Analyze screenshots with OpenAI
		const analysis = await analyzeVideoScreenshots(prompt, screenshots);

		if (analysis.success) {
			return json({
				success: true,
				title: analysis.title,
				description: analysis.description
			});
		} else {
			// If AI analysis fails, return the error but still provide fallback
			return json({
				success: false,
				error: analysis.error || 'Analysis failed',
				fallback: generateFallbackDescription('video')
			});
		}
	} catch (error) {
		console.error('Error in analyze-video API:', error);

		return json(
			{
				success: false,
				error: 'Internal server error during analysis'
			},
			{ status: 500 }
		);
	}
};
