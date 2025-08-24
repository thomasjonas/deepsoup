import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export interface VideoAnalysisResult {
	success: boolean;
	description?: string;
	title?: string;
	error?: string;
}

// Analyze video screenshots using OpenAI Vision API
export async function analyzeVideoScreenshots(screenshots: string[]): Promise<VideoAnalysisResult> {
	try {
		if (!screenshots || screenshots.length === 0) {
			return {
				success: false,
				error: 'No screenshots provided for analysis'
			};
		}

		// Prepare the content array with text prompt and images
		const content: Array<any> = [
			{
				type: 'text',
				text: `Analyze these video screenshots and provide a detailed description (2-3 sentences) of what's happening in the video.

Focus on the main subject, actions, mood, and visual style. Be creative but accurate based on what you see in the screenshots.`
			}
		];

		// Add each screenshot to the content array
		screenshots.forEach((screenshot, index) => {
			content.push({
				type: 'image_url',
				image_url: {
					url: screenshot,
					detail: 'low' // Use low detail for cost optimization
				}
			});
		});

		const response = await openai.chat.completions.create({
			model: 'gpt-4.1-mini',
			messages: [
				{
					role: 'user',
					content: content
				}
			],
			max_tokens: 300,
			temperature: 0.7
		});

		const description = response.choices[0]?.message?.content;

		if (!description) {
			return {
				success: false,
				error: 'No analysis received from OpenAI'
			};
		}

		return {
			success: true,
			description
		};
	} catch (error) {
		console.error('Error analyzing video screenshots:', error);

		// Return a user-friendly error message
		let errorMessage = 'Failed to analyze video content';

		if (error instanceof Error) {
			if (error.message.includes('rate_limit')) {
				errorMessage = 'OpenAI API rate limit exceeded. Please try again later.';
			} else if (error.message.includes('quota')) {
				errorMessage = 'OpenAI API quota exceeded. Please check your API limits.';
			} else if (error.message.includes('invalid_api_key')) {
				errorMessage = 'Invalid OpenAI API key configured.';
			}
		}

		return {
			success: false,
			error: errorMessage
		};
	}
}

// Fallback function for when OpenAI analysis fails
export function generateFallbackDescription(filename: string): VideoAnalysisResult {
	// Generate a basic title from filename
	const title = filename
		.replace(/\.[^/.]+$/, '') // Remove extension
		.replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
		.replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
		.substring(0, 60);

	const description =
		'A video submission uploaded to the platform. Content analysis was not available at the time of upload.';

	return {
		success: true,
		title: title || 'Video Upload',
		description
	};
}
