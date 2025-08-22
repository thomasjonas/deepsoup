import { json } from '@sveltejs/kit';
import { analyzeVideoScreenshots, generateFallbackDescription } from '$lib/server/openai';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { screenshots } = await request.json();

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
		const analysis = await analyzeVideoScreenshots(screenshots);

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
