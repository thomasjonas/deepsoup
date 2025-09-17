<script lang="ts">
	import { PUBLIC_BUNNY_STORAGE_ZONE_NAME } from '$env/static/public';
	import type { getAllVideos } from '$lib/server/db/videos';
	import { Button, Modal } from 'flowbite-svelte';
	import { DownloadSolid, TrashBinSolid } from 'flowbite-svelte-icons';

	type Video = Awaited<ReturnType<typeof getAllVideos>>[0];
	let { video, onClose }: { video?: Video; onClose: () => void } = $props();

	let showModal = $derived(!!video);
</script>

{#if video}
	<Modal title={video.title || 'Video Details'} bind:open={showModal} onclose={onClose} size="lg">
		<div style="position:relative;padding-top:56.25%;">
			<div class="absolute inset-0 overflow-hidden">
				<img
					alt="preview thumbnail"
					class="h-full w-full scale-105 object-cover blur-md"
					src="https://{PUBLIC_BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/{video.bunnyVideoId}/thumbnail.jpg"
				/>
			</div>
			<iframe
				title={video.title}
				src={video.bunnyStreamUrl}
				style="border:0;position:absolute;top:0;height:100%;width:100%;"
				allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
				allowfullscreen
			></iframe>
		</div>
		<div class="w-full space-y-2 lg:grid lg:grid-cols-2">
			<div>
				<p>Uploader: {video.userName}</p>
				<p>Email: {video.userEmail}</p>
				<p>Instagram: {video.instagramHandle}</p>
			</div>
			<div>
				<p>Duration: {video.durationFormatted}</p>
				<p>Size: {video.fileSizeMB} MB</p>
				<p>
					Uploaded:
					{video.uploadDate ? new Date(video.uploadDate).toLocaleString() : '-'}
				</p>
			</div>
			<div class="col-span-2 text-xs">
				<pre class="text-wrap">{video.aiDescription}</pre>
			</div>
		</div>
		<div class="flex gap-4">
			<Button color="red"><TrashBinSolid />Remove</Button>
			<Button
				color="blue"
				download
				href={`/download/${video?.bunnyVideoId}?filename=${video.originalFilename}`}
				><DownloadSolid />Download</Button
			>
		</div>
	</Modal>
{/if}
