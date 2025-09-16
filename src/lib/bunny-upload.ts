import * as tus from 'tus-js-client';

export async function uploadToBunny(
	file: File,
	{
		libraryId,
		videoId,
		apiKey,
		expires,
		signature,
		metadata
	}: {
		libraryId: string;
		videoId: string;
		apiKey?: string;
		expires: number;
		signature: string;
		metadata: Record<string, string>;
	}
) {
	return new Promise((resolve, reject) => {
		const upload = new tus.Upload(file, {
			endpoint: 'https://video.bunnycdn.com/tusupload',
			headers: {
				AuthorizationSignature: signature,
				AuthorizationExpire: expires.toString(),
				LibraryId: libraryId,
				VideoId: videoId
			},
			metadata: {
				filename: file.name,
				filetype: file.type,
				...metadata
			},
			retryDelays: [0, 3000, 5000, 10000, 20000],
			onError(err) {
				console.error('Upload failed:', err);
				reject(err);
			},
			onProgress(bytesUploaded, bytesTotal) {
				const percentage = (bytesUploaded / bytesTotal) * 100;
				// you can propagate this to UI via some callback or store
				console.log(`Uploaded ${bytesUploaded} of ${bytesTotal} (${percentage.toFixed(2)}%)`);
			},
			onSuccess() {
				console.log('Upload succeeded:', upload.url);
				resolve(upload);
			}
		});

		upload.start();
	});
}
