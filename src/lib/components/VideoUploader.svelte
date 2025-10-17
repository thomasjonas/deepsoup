<script lang="ts">
	import * as Sentry from '@sentry/sveltekit';
	import { uploadToBunny } from '$lib/bunny-upload';
	import { appState } from '$lib/state.svelte';
	import { onDestroy, tick } from 'svelte';

	let {
		onError,
		onSuccess,
		onDescription,
		onStart,
		onDragStateChange
	}: {
		onError: (message: string) => void;
		onSuccess: ({
			id,
			filename,
			duration,
			size,
			description
		}: {
			id: string;
			filename: string;
			duration: number;
			size: number;
			description: string;
		}) => void;
		onDescription: (description: string) => void;
		onStart: () => void;
		onDragStateChange: (state: boolean) => void;
	} = $props();

	let dragZone: HTMLDivElement;
	let videoPreview: HTMLVideoElement;
	let fileInput: HTMLInputElement;

	let selectedFile = $state<File | null>(null);
	let screenshots = $state<string[]>([]);
	let isUploading = $state(false);
	let isAnalyzing = $state(false);
	let duration = $state(0);
	let fileSize = $state(0);
	let description = $state('');
	let videoId: string = $state('');
	let uploadStartTime = $state(Date.now());
	let text = $state('Uploading');

	$effect(() => {
		fileSize = selectedFile?.size ?? 0;
	});

	$effect(() => {
		if (appState.finishedDescriptions) checkSuccess();
	});

	function checkSuccess() {
		console.log('checkSuccess', {
			selectedFile,
			isAnalyzing,
			isUploading,
			finishedDescriptions: appState.finishedDescriptions
		});
		if (!selectedFile || isAnalyzing || isUploading || !appState.finishedDescriptions) return;

		const timeDiff = (Date.now() - uploadStartTime) / 1000;
		if (timeDiff < 30) {
			setTimeout(checkSuccess, timeDiff * 1000);
			return;
		}

		onSuccess({
			id: videoId,
			duration,
			size: fileSize,
			filename: selectedFile.name,
			description
		});
	}

	async function startUpload() {
		if (!selectedFile) return;
		isUploading = true;
		let uploadStartTime = Date.now();

		// first, call your backend to create the Bunny video object + signature data
		const resp = await fetch('/api/bunny-signature', {
			method: 'POST',
			body: JSON.stringify({ filename: selectedFile.name, filetype: selectedFile.type /* etc */ })
		});
		const { libraryId, videoId: vidId, signature, expires } = await resp.json();

		try {
			await uploadToBunny(selectedFile, {
				libraryId,
				videoId: vidId,
				signature,
				expires,
				metadata: { title: selectedFile.name }
			});
			videoId = vidId;
		} catch (error: any) {
			onError(error.toString());
			Sentry.captureException(error);
		} finally {
			isUploading = false;
			checkSuccess();
		}
	}

	// Handle file selection
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processSelectedFile(file);
			startUpload();
		}
	}

	// Handle drag and drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		onDragStateChange(false);

		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('video/')) {
			processSelectedFile(file);
			startUpload();
		} else {
			onError('Please select a valid video file');
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		onDragStateChange(true);
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		onDragStateChange(false);
	}

	// Process selected file
	async function processSelectedFile(file: File) {
		// Validate file
		if (!file.type.startsWith('video/')) {
			onError('Please select a valid video file');
			return;
		}

		// Check file size (300MB limit)
		// if (file.size > 300 * 1024 * 1024) {
		// 	onError('File size must be less than 300MB');
		// 	return;
		// }

		onStart();
		selectedFile = file;
		text = 'Uploading';
		onError('');

		// Wait for DOM to update so video element is rendered
		await tick();

		// Set up video preview
		const videoUrl = URL.createObjectURL(file);
		videoPreview.src = videoUrl;
		videoPreview.load();

		// Wait for video metadata to load
		videoPreview.onloadedmetadata = async () => {
			duration = videoPreview.duration;
			// Extract screenshots for AI analysis
			await extractScreenshots();
		};
	}

	// Extract screenshots from video for AI analysis
	async function extractScreenshots() {
		if (!videoPreview || !selectedFile) return;

		isAnalyzing = true;
		screenshots = [];

		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Could not get canvas context');

			const duration = videoPreview.duration;
			const timestamps = [
				duration * 0.1, // 10%
				duration * 0.3, // 30%
				duration * 0.5, // 50%
				duration * 0.7, // 70%
				duration * 0.9 // 90%
			];

			for (const timestamp of timestamps) {
				await new Promise<void>((resolve) => {
					videoPreview.currentTime = timestamp;
					videoPreview.onseeked = () => {
						let width = videoPreview.videoWidth;
						let height = videoPreview.videoHeight;

						// Max size
						const MAX_SIZE = 1024;

						// Scale down if necessary
						if (width > MAX_SIZE || height > MAX_SIZE) {
							const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);
							width = Math.floor(width * scale);
							height = Math.floor(height * scale);
						}

						// Set canvas size
						canvas.width = width;
						canvas.height = height;

						// Draw video frame to canvas with scaling
						ctx.drawImage(videoPreview, 0, 0, width, height);

						// Convert to base64 image
						let dataUrl = canvas.toDataURL('image/jpeg', 0.8);
						if (dataUrl === 'data:,') {
							console.warn('Empty image generated');
						} else {
							screenshots = [...screenshots, dataUrl];
						}
						resolve();
					};
				});
			}

			// Send screenshots to AI for analysis
			await analyzeVideoWithAI();
		} catch (error) {
			console.error('Error extracting screenshots:', error);
			Sentry.captureException(error);
			onError('Failed to analyze video content');
		} finally {
			text = 'Analysing';
			isAnalyzing = false;
			checkSuccess();
		}
	}

	// Send screenshots to AI for analysis
	async function analyzeVideoWithAI() {
		if (screenshots.length === 0) return;

		try {
			const response = await fetch('/api/analyze-video', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					screenshots
				})
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					description = result.description;
					onDescription(result.description);
				} else {
					console.error('AI analysis failed:', result.error);
					onDescription('DESCRIPTION_ERROR');
				}
			} else {
				const error = await response.json();
				throw new Error(error.error);
			}
		} catch (error) {
			console.error('Error calling AI analysis:', error);
			Sentry.captureException(error);
			onDescription('DESCRIPTION_ERROR');
		}
	}

	function reset() {
		selectedFile = null;
		text = 'Uploading';
		screenshots = [];
		isUploading = false;
		isAnalyzing = false;
		duration = 0;
		fileSize = 0;
		description = '';
		videoId = '';
		uploadStartTime = Date.now();
	}

	onDestroy(() => {
		console.log('destroyed video uploader');
		reset();
	});
</script>

<div
	bind:this={dragZone}
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	class="pointer-events-auto"
	role="button"
	aria-label="Upload or drag and drop files"
	tabindex="0"
>
	{#if selectedFile}
		<video bind:this={videoPreview} class="hidden" playsinline controls muted></video>
		{text}
	{:else}
		<button type="button" onclick={() => fileInput.click()} class="">
			<span class="lg:hidden">Tap to upload your video</span>
			<span class="hidden lg:block">Click or drag and drop to upload your video</span>
		</button>
	{/if}
</div>

<input
	bind:this={fileInput}
	type="file"
	accept="video/*"
	onchange={handleFileSelect}
	class="hidden"
/>
