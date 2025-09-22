<script lang="ts">
	import DashedBox from './DashedBox.svelte';

	let {
		video,
		onError
	}: {
		video: {
			filename: string;
			id: string;
			duration: number;
			size: number;
			description: string;
		};
		onError: (message: string) => void;
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

		if (!video || !formData.name || !formData.email) {
			onError('Please fill in all required fields and select a video');
			return;
		}

		if (!formData.email) {
			onError('Please enter a valid email address');
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
				// resetForm();
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
	<div class="text-left">
		<p class="mb-8">Thank you, your contribution has entered Deep Soup!</p>
		<p>We reach out to you to witness the encounter with a non-human intelligence.</p>
	</div>
{:else}
	<form onsubmit={handleSubmit} class="pointer-events-auto text-left">
		<div class="mb-8">Upload complete!<br />For credits and viewing info we just need your...</div>
		<div class="input-container">
			<label for="name" class="">Name</label>
			<div class="relative flex flex-1">
				<DashedBox class="grow" fullyRounded>
					<input id="name" class="w-full" type="text" bind:value={formData.name} required />
				</DashedBox>
			</div>
		</div>

		<div class="input-container">
			<label for="email" class="">Email</label>
			<DashedBox class="grow" fullyRounded>
				<input id="email" class="w-full" type="email" bind:value={formData.email} required />
			</DashedBox>
		</div>

		<div class="input-container">
			<label for="instagram" class=""> Instagram </label>
			<DashedBox class="shrink grow" fullyRounded>
				<input id="instagram" type="text" bind:value={formData.instagramHandle} class=" w-full" />
			</DashedBox>
		</div>

		<div class="input-container justify-between">
			<label for="terms_conditions" class="">
				I agree with <a href="#" class="underline decoration-2 underline-offset-3"
					>terms and conditions</a
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
			disabled={isUploading}
			class="my-4 underline decoration-2 underline-offset-3"
			class:opacity-50={isUploading}>Submit</button
		>
	</form>
{/if}
