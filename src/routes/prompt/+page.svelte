<script lang="ts">
	import { onMount, tick } from 'svelte';

	let fileInput: HTMLInputElement;
	let videoPreview: HTMLVideoElement;
	let dragZone: HTMLDivElement;

	// Form state using Svelte 5 runes
	let selectedFile = $state<File | null>(null);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let aiDescription = $state('');
	let aiTitle = $state('');
	let isAnalyzing = $state(false);
	let screenshots = $state<string[]>([]);

	// Form data
	let formData = $state({
		name: '',
		email: '',
		instagramHandle: '',
		prompt: `Analyze these video screenshots and analyze what is happening. Describe 3 funny things that happened. Make sure every description is no longer than 5 words. 

Use the following format:
- [Funny thing 1]
- [Funny thing 2]
- [Funny thing 3]`
	});

	let uploadError = $state('');
	let uploadSuccess = $state(false);

	// Handle file selection
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processSelectedFile(file);
		}
	}

	// Handle drag and drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragZone.classList.remove('border-blue-500', 'bg-blue-50');

		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('video/')) {
			processSelectedFile(file);
		} else {
			uploadError = 'Please select a valid video file';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragZone.classList.add('border-blue-500', 'bg-blue-50');
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragZone.classList.remove('border-blue-500', 'bg-blue-50');
	}

	// Process selected file
	async function processSelectedFile(file: File) {
		// Validate file
		if (!file.type.startsWith('video/')) {
			uploadError = 'Please select a valid video file';
			return;
		}

		// Check file size (300MB limit)
		if (file.size > 300 * 1024 * 1024) {
			uploadError = 'File size must be less than 300MB';
			return;
		}

		selectedFile = file;
		uploadError = '';

		// Wait for DOM to update so video element is rendered
		await tick();

		// Set up video preview
		const videoUrl = URL.createObjectURL(file);
		videoPreview.src = videoUrl;
		videoPreview.load();

		// Wait for video metadata to load
		videoPreview.onloadedmetadata = async () => {
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
				duration * 0.2, // 10%
				duration * 0.3, // 30%
				duration * 0.5, // 10%
				duration * 0.6, // 60%
				duration * 0.75, // 60%
				duration * 0.9 // 90%
			];

			for (const timestamp of timestamps) {
				await new Promise<void>((resolve) => {
					videoPreview.currentTime = timestamp;
					videoPreview.onseeked = () => {
						// Set canvas size to video dimensions
						canvas.width = videoPreview.videoWidth;
						canvas.height = videoPreview.videoHeight;

						// Draw video frame to canvas
						ctx.drawImage(videoPreview, 0, 0, canvas.width, canvas.height);

						// Convert to base64 image
						const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
						screenshots = [...screenshots, dataUrl];
						resolve();
					};
				});
			}

			// Send screenshots to AI for analysis
			await analyzeVideoWithAI();
		} catch (error) {
			console.error('Error extracting screenshots:', error);
			uploadError = 'Failed to analyze video content';
		} finally {
			isAnalyzing = false;
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
					prompt: formData.prompt,
					screenshots
				})
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					aiTitle = result.title || '';
					aiDescription = result.description || '';
				} else {
					console.error('AI analysis failed:', result.error);
					alert(result.error);
				}
			} else {
				const error = await response.json();
				throw new Error(error.error);
			}
		} catch (error) {
			console.error('Error calling AI analysis:', error);
		}
	}

	// Handle form submission
	async function handleSubmit() {
		if (!selectedFile || !formData.name || !formData.email) {
			uploadError = 'Please fill in all required fields and select a video';
			return;
		}

		if (!formData.email.includes('@')) {
			uploadError = 'Please enter a valid email address';
			return;
		}

		isUploading = true;
		uploadProgress = 0;
		uploadError = '';

		try {
			// Create form data for upload
			const uploadFormData = new FormData();
			uploadFormData.append('video', selectedFile);
			uploadFormData.append('name', formData.name);
			uploadFormData.append('email', formData.email);
			uploadFormData.append('instagramHandle', formData.instagramHandle);
			uploadFormData.append('aiTitle', aiTitle);
			uploadFormData.append('aiDescription', aiDescription);
			uploadFormData.append('duration', videoPreview.duration.toString());
			uploadFormData.append('fileSize', selectedFile.size.toString());

			// Upload to server using Fetch API
			const response = await fetch('/api/upload-video', {
				method: 'POST',
				body: uploadFormData
			});

			if (response.ok) {
				uploadSuccess = true;
				resetForm();
			} else {
				const errorData = await response.json().catch(() => ({}));
				uploadError = errorData.error || 'Upload failed. Please try again.';
			}
		} catch (error) {
			uploadError = 'Upload failed. Please check your connection.';
		} finally {
			isUploading = false;
		}
	}

	// Reset form after successful upload
	function resetForm() {
		selectedFile = null;
		formData = {
			name: '',
			email: '',
			instagramHandle: '',
			prompt: `Analyze these video screenshots and provide a detailed description (2-3 sentences) of what's happening in the video.

Focus on the main subject, actions, mood, and visual style. Be creative but accurate based on what you see in the screenshots.`
		};
		aiTitle = '';
		aiDescription = '';
		screenshots = [];
		uploadProgress = 0;
		if (videoPreview) videoPreview.src = '';
		if (fileInput) fileInput.value = '';
	}

	// Reset success message
	function resetSuccess() {
		uploadSuccess = false;
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-8">
	<div class="mx-auto max-w-md">
		<!-- Header -->
		<!-- <div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Video Upload</h1>
			<p class="text-gray-600">Share your video with us</p>
		</div> -->

		{#if uploadSuccess}
			<!-- Success Message -->
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Upload Successful!</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>Your video has been uploaded successfully. Thank you for your submission!</p>
						</div>
						<div class="mt-4">
							<button
								onclick={resetSuccess}
								class="rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200"
							>
								Upload Another Video
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Upload Form -->
			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- File Upload Area -->
				<div
					bind:this={dragZone}
					class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors"
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					role="button"
					aria-label="Upload or drag and drop files"
					tabindex="0"
				>
					{#if selectedFile}
						<div class="space-y-4">
							<video bind:this={videoPreview} class="max-h-48 w-full rounded-lg" controls muted
							></video>
							<div class="text-sm text-gray-600">
								<p class="font-medium">{selectedFile.name}</p>
								<p>{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
							</div>
							<button
								type="button"
								onclick={() => fileInput.click()}
								class="text-sm font-medium text-blue-600 hover:text-blue-700"
							>
								Choose Different File
							</button>
						</div>
					{:else}
						<div class="space-y-4">
							<svg
								class="mx-auto h-12 w-12 text-gray-400"
								stroke="currentColor"
								fill="none"
								viewBox="0 0 48 48"
							>
								<path
									d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<div class="text-gray-600">
								<button
									type="button"
									onclick={() => fileInput.click()}
									class="font-medium text-blue-600 hover:text-blue-700"
								>
									Click to select
								</button>
								or drag and drop your video here
							</div>
							<p class="text-xs text-gray-500">MP4, MOV up to 300MB</p>
						</div>
					{/if}
				</div>

				<input
					bind:this={fileInput}
					type="file"
					accept="video/*"
					onchange={handleFileSelect}
					class="hidden"
				/>

				<!-- AI Analysis Status -->
				{#if isAnalyzing}
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div class="flex items-center">
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
							></div>
							<span class="ml-2 text-sm text-blue-800">Analyzing video content...</span>
						</div>
					</div>
				{/if}

				<!-- AI Generated Description -->
				{#if aiTitle || aiDescription}
					<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<h3 class="mb-2 text-sm font-medium text-gray-900">AI Analysis</h3>
						{#if aiDescription}
							<pre class="text-sm text-gray-600">{aiDescription}</pre>
						{/if}
					</div>
				{/if}

				<div class="space-y-4">
					<div>
						<label for="prompt" class="mb-1 block text-sm font-medium text-gray-700">
							Prompt *
						</label>
						<textarea id="prompt" class="h-96 w-full" bind:value={formData.prompt}></textarea>
					</div>
				</div>

				<!-- User Information Form -->
				<!-- <div class="space-y-4">
					<div>
						<label for="name" class="mb-1 block text-sm font-medium text-gray-700">
							Full Name *
						</label>
						<input
							id="name"
							type="text"
							bind:value={formData.name}
							required
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="Your full name"
						/>
					</div>

					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
							Email Address *
						</label>
						<input
							id="email"
							type="email"
							bind:value={formData.email}
							required
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label for="instagram" class="mb-1 block text-sm font-medium text-gray-700">
							Instagram Handle
						</label>
						<input
							id="instagram"
							type="text"
							bind:value={formData.instagramHandle}
							class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="@username"
						/>
					</div>
				</div> -->

				<!-- Error Message -->
				{#if uploadError}
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<p class="text-sm text-red-800">{uploadError}</p>
					</div>
				{/if}

				<!-- Upload Progress -->
				{#if isUploading}
					<div class="space-y-2">
						<div class="flex justify-between text-sm text-gray-600">
							<span>Uploading...</span>
							<span>{Math.round(uploadProgress)}%</span>
						</div>
						<div class="h-2 w-full rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full bg-blue-600 transition-all duration-300"
								style="width: {uploadProgress}%"
							></div>
						</div>
					</div>
				{/if}

				<button
					type="button"
					onclick={extractScreenshots}
					disabled={!selectedFile || isAnalyzing || !formData.prompt}
					class="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isAnalyzing}
						Analyzing Video...
					{:else}
						Analyze video
					{/if}
				</button>

				<!-- Submit Button -->
				<!-- <button
					type="submit"
					disabled={!selectedFile ||
						isUploading ||
						isAnalyzing ||
						!formData.name ||
						!formData.email}
					class="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isUploading}
						Uploading Video...
					{:else if isAnalyzing}
						Analyzing Video...
					{:else}
						Upload Video
					{/if}
				</button> -->
			</form>
		{/if}
	</div>
</div>
