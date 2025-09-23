import { env } from '$env/dynamic/private';

export interface BunnyStreamVideo {
	videoLibraryId: number;
	guid: string;
	title: string;
	dateUploaded: string;
	views: number;
	isPublic: boolean;
	length: number;
	status: number;
	frameworkUrl: string;
	thumbnailUrl: string;
	mp4Url: string;
}

export interface CreateVideoResponse {
	success: boolean;
	message: string;
	guid?: string;
	videoLibraryId?: number;
}

export interface UploadResponse {
	success: boolean;
	message: string;
	videoUrl?: string;
	embedUrl?: string;
}

const BUNNY_API_BASE = 'https://video.bunnycdn.com';

// Create a new video entry in BunnyStream
export async function createVideo(title: string): Promise<CreateVideoResponse> {
	try {
		const response = await fetch(`${BUNNY_API_BASE}/library/${env.BUNNY_LIBRARY_ID}/videos`, {
			method: 'POST',
			headers: {
				AccessKey: env.BUNNY_API_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				success: false,
				message: `Failed to create video: ${response.status} ${errorText}`
			};
		}

		const data = await response.json();
		return {
			success: true,
			message: 'Video created successfully',
			guid: data.guid,
			videoLibraryId: data.videoLibraryId
		};
	} catch (error) {
		return {
			success: false,
			message: `Error creating video: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}

// Upload video file to BunnyStream
export async function uploadVideo(
	videoId: string,
	videoFile: Buffer,
	filename: string
): Promise<UploadResponse> {
	try {
		const response = await fetch(
			`${BUNNY_API_BASE}/library/${env.BUNNY_LIBRARY_ID}/videos/${videoId}`,
			{
				method: 'PUT',
				headers: {
					AccessKey: env.BUNNY_API_KEY,
					'Content-Type': 'application/octet-stream'
				},
				body: videoFile
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			return {
				success: false,
				message: `Failed to upload video: ${response.status} ${errorText}`
			};
		}

		// Generate URLs for the uploaded video
		const videoUrl = `https://iframe.mediadelivery.net/embed/${env.BUNNY_LIBRARY_ID}/${videoId}`;
		const embedUrl = `https://iframe.mediadelivery.net/embed/${env.BUNNY_LIBRARY_ID}/${videoId}?autoplay=true&preload=true`;

		return {
			success: true,
			message: 'Video uploaded successfully',
			videoUrl,
			embedUrl
		};
	} catch (error) {
		return {
			success: false,
			message: `Error uploading video: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}

// Get video information from BunnyStream
export async function getVideoInfo(videoId: string): Promise<BunnyStreamVideo | null> {
	try {
		const response = await fetch(
			`${BUNNY_API_BASE}/library/${env.BUNNY_LIBRARY_ID}/videos/${videoId}`,
			{
				headers: {
					AccessKey: env.BUNNY_API_KEY
				}
			}
		);

		if (!response.ok) {
			console.error(`Failed to get video info: ${response.status}`);
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting video info:', error);
		return null;
	}
}

// Get all videos from BunnyStream library
export async function listVideos(): Promise<BunnyStreamVideo[]> {
	try {
		const response = await fetch(`${BUNNY_API_BASE}/library/${env.BUNNY_LIBRARY_ID}/videos`, {
			headers: {
				AccessKey: env.BUNNY_API_KEY
			}
		});

		if (!response.ok) {
			console.error(`Failed to list videos: ${response.status}`);
			return [];
		}

		const data = await response.json();
		return data.items || [];
	} catch (error) {
		console.error('Error listing videos:', error);
		return [];
	}
}

// Get direct download URL for a video
export async function getDownloadUrl(videoId: string): Promise<string | null> {
	try {
		const videoInfo = await getVideoInfo(videoId);
		if (!videoInfo) {
			return null;
		}

		// BunnyStream provides MP4 URLs directly
		return videoInfo.mp4Url || null;
	} catch (error) {
		console.error('Error getting download URL:', error);
		return null;
	}
}

// Delete video from BunnyStream
export async function deleteVideo(videoId: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${BUNNY_API_BASE}/library/${env.BUNNY_LIBRARY_ID}/videos/${videoId}`,
			{
				method: 'DELETE',
				headers: {
					AccessKey: env.BUNNY_API_KEY
				}
			}
		);

		return response.ok;
	} catch (error) {
		console.error('Error deleting video:', error);
		return false;
	}
}
