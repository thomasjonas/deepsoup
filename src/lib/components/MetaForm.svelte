<script lang="ts">
	import DashedBox from './DashedBox.svelte';

	let {
		video,
		onError,
		restart
	}: {
		video: {
			filename: string;
			id: string;
			duration: number;
			size: number;
			description: string;
		};
		onError: (message: string) => void;
		restart: () => void;
	} = $props();

	let isUploading = $state(false);
	let uploadSuccess = $state(false);
	let formData = $state({
		name: '',
		email: '',
		instagramHandle: '',
		termsAndConditions: false
	});

	// Handle form submission
	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!video) {
			onError('Please select a video');
			return;
		}

		isUploading = true;
		onError('');

		try {
			// Create form data for upload
			const uploadFormData = new FormData();
			uploadFormData.append('videoId', video.id);
			uploadFormData.append('name', formData.name);
			uploadFormData.append('email', formData.email);
			uploadFormData.append('instagramHandle', formData.instagramHandle);
			uploadFormData.append('aiDescription', video.description);
			uploadFormData.append('videoFileSize', video.size?.toString());
			uploadFormData.append('videoDuration', video.duration?.toString());
			uploadFormData.append('videoFileName', video.filename);

			// Upload to server using Fetch API
			const response = await fetch('/api/upload-video', {
				method: 'POST',
				body: uploadFormData
			});

			if (response.ok) {
				uploadSuccess = true;
			} else {
				const errorData = await response.json().catch(() => ({}));
				onError(errorData.error || 'Upload failed. Please try again.');
			}
		} catch (error) {
			console.error(error);
			onError('Upload failed. Please check your connection.');
		} finally {
			isUploading = false;
		}
		return false;
	}
</script>

{#if uploadSuccess}
	<div class="pointer-events-auto text-left">
		<p class="mb-8">Thank you, your contribution has entered Deep Soup!</p>
		<p>
			If you shared your contact, we’ll soon invite you to witness an encounter with a non-human
			intelligence. Everyone else: make sure to keep a close eye on IG <a
				href="https://www.instagram.com/deepsoup.io"
				target="_blank">deepsoup.io</a
			>
		</p>
		<button type="button" class="my-4 underline decoration-2 underline-offset-3" onclick={restart}
			>OK</button
		>
	</div>
{:else}
	<form onsubmit={handleSubmit} class="pointer-events-auto text-left">
		<div class="mb-8">Upload complete!<br />For credits and viewing info we just need your...</div>
		<div class="input-container">
			<label for="name" class="">Name</label>
			<div class="relative flex flex-1">
				<DashedBox class="grow" fullyRounded>
					<input id="name" class="w-full" type="text" bind:value={formData.name} />
				</DashedBox>
			</div>
		</div>

		<div class="input-container">
			<label for="email" class="">Email</label>
			<DashedBox class="grow" fullyRounded>
				<input id="email" class="w-full" type="email" bind:value={formData.email} />
			</DashedBox>
		</div>

		<div class="input-container">
			<label for="instagram" class=""> Instagram </label>
			<DashedBox class="shrink grow" fullyRounded>
				<input id="instagram" type="text" bind:value={formData.instagramHandle} class="w-full" />
			</DashedBox>
		</div>

		<div class="input-container justify-between">
			<label for="terms_conditions" class="">
				I agree with <a
					href="/terms-and-conditions"
					target="_blank"
					class="underline decoration-2 underline-offset-3">terms and conditions</a
				></label
			>
			<DashedBox fullyRounded>
				<input
					id="terms_conditions"
					type="checkbox"
					bind:checked={formData.termsAndConditions}
					class="-mr-px -mb-px h-[45px] w-[45px] lg:h-[80px] lg:w-[80px]"
				/>
			</DashedBox>
		</div>

		<button
			type="submit"
			disabled={isUploading || !formData.termsAndConditions}
			class="my-4 underline decoration-2 underline-offset-3"
			class:opacity-50={isUploading || !formData.termsAndConditions}>Submit</button
		>
	</form>
{/if}
