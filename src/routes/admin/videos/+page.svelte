<script lang="ts">
	import {
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge,
		Button,
		Modal
	} from 'flowbite-svelte';
	import { formatDistanceToNow } from 'date-fns';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Modal state
	let showVideoModal = $state(false);
	let selectedVideo = $state<any>(null);

	// Format status for display
	function getStatusBadge(status: string) {
		switch (status) {
			case 'ready':
				return { color: 'green' as const, text: 'Ready' };
			case 'processing':
				return { color: 'yellow' as const, text: 'Processing' };
			case 'uploading':
				return { color: 'blue' as const, text: 'Uploading' };
			case 'failed':
				return { color: 'red' as const, text: 'Failed' };
			default:
				return { color: 'gray' as const, text: 'Unknown' };
		}
	}

	// Format upload date
	function formatUploadDate(dateString: string | null) {
		if (!dateString) return 'Unknown';
		const date = new Date(dateString);
		return formatDistanceToNow(date, { addSuffix: true });
	}

	// Show video modal
	function viewVideo(video: any) {
		selectedVideo = video;
		showVideoModal = true;
	}

	// Download video
	async function downloadVideo(video: any) {
		if (!video.downloadUrl && !video.bunnyVideoId) {
			alert('Download URL not available for this video');
			return;
		}

		try {
			// If we have a direct download URL, use it
			if (video.downloadUrl) {
				const link = document.createElement('a');
				link.href = video.downloadUrl;
				link.download = video.originalFilename || `${video.title}.mp4`;
				link.target = '_blank';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else {
				// Fallback to API endpoint for download
				const response = await fetch(`/api/admin/videos/${video.id}/download`);

				if (response.ok) {
					const blob = await response.blob();
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = video.originalFilename || `${video.title}.mp4`;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
				} else {
					alert('Failed to download video');
				}
			}
		} catch (error) {
			console.error('Download error:', error);
			alert('Failed to download video');
		}
	}

	// Get BunnyStream embed URL
	function getEmbedUrl(video: any) {
		if (video.bunnyStreamUrl) {
			return video.bunnyStreamUrl;
		}
		// Fallback construction if needed
		if (video.bunnyVideoId) {
			// This would need the library ID from env, but we'll use what we have
			return `https://iframe.mediadelivery.net/embed/YOUR_LIBRARY_ID/${video.bunnyVideoId}`;
		}
		return null;
	}
</script>

<svelte:head>
	<title>Video Management - Admin Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Video Management</h1>
			<p class="mt-1 text-sm text-gray-600">
				Manage all uploaded videos, view content, and download files
			</p>
		</div>
		<div class="flex gap-4">
			<a
				href="/admin"
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				← Back to Dashboard
			</a>
		</div>
	</div>

	<!-- Statistics Summary -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
		<Card class="p-4">
			<div class="text-center">
				<p class="text-2xl font-bold text-blue-600">{data.videos.length}</p>
				<p class="text-sm text-gray-600">Total Videos</p>
			</div>
		</Card>
		<Card class="p-4">
			<div class="text-center">
				<p class="text-2xl font-bold text-green-600">
					{data.videos.reduce((sum, video) => sum + (video.fileSizeMB || 0), 0)} MB
				</p>
				<p class="text-sm text-gray-600">Total Storage</p>
			</div>
		</Card>
		<Card class="p-4">
			<div class="text-center">
				<p class="text-2xl font-bold text-purple-600">
					{data.videos.filter((v) => v.status === 'ready').length}
				</p>
				<p class="text-sm text-gray-600">Ready to View</p>
			</div>
		</Card>
	</div>

	<!-- Videos Table -->
	<Card class="p-6">
		<div class="mb-4">
			<h2 class="text-lg font-medium text-gray-900">All Videos</h2>
		</div>

		{#if data.videos.length > 0}
			<div class="overflow-x-auto">
				<Table hoverable={true}>
					<TableHead>
						<TableHeadCell>Video Details</TableHeadCell>
						<TableHeadCell>Uploader Info</TableHeadCell>
						<TableHeadCell>Technical</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Actions</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each data.videos as video (video.id)}
							<TableBodyRow>
								<TableBodyCell>
									<div class="space-y-1">
										<div class="max-w-xs truncate font-medium text-gray-900">
											{video.title || 'Untitled Video'}
										</div>
										<div class="text-xs text-gray-500">
											{video.originalFilename}
										</div>
										{#if video.aiDescription}
											<div class="max-w-xs truncate text-xs text-gray-600">
												{video.aiDescription}
											</div>
										{/if}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="space-y-1">
										<div class="text-sm font-medium text-gray-900">
											{video.userName}
										</div>
										<div class="text-xs text-gray-600">
											{video.userEmail}
										</div>
										{#if video.instagramHandle}
											<div class="text-xs text-blue-600">
												{video.instagramHandle}
											</div>
										{/if}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="space-y-1">
										<div class="text-xs text-gray-600">
											{video.durationFormatted || '-'} • {video.fileSizeMB} MB
										</div>
										<div class="text-xs text-gray-500">
											{formatUploadDate(video.uploadDate)}
										</div>
									</div>
								</TableBodyCell>
								<TableBodyCell>
									{@const statusInfo = getStatusBadge(video.status)}
									<Badge color={statusInfo.color}>{statusInfo.text}</Badge>
								</TableBodyCell>
								<TableBodyCell>
									<div class="flex space-x-2">
										{#if video.bunnyStreamUrl || video.bunnyVideoId}
											<Button size="xs" color="blue" onclick={() => viewVideo(video)}>View</Button>
										{/if}
										<Button size="xs" color="green" onclick={() => downloadVideo(video)}>
											Download
										</Button>
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{:else}
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No videos yet</h3>
				<p class="mt-1 text-sm text-gray-500">Videos uploaded by users will appear here.</p>
			</div>
		{/if}
	</Card>
</div>

<!-- Video View Modal -->
<Modal bind:open={showVideoModal} size="xl" title="Video Player">
	{#if selectedVideo}
		<div class="space-y-4">
			<!-- Video Player -->
			<div class="aspect-video w-full">
				{#if selectedVideo}
					{@const embedUrl = getEmbedUrl(selectedVideo)}
					{#if embedUrl}
						<iframe
							src={embedUrl}
							class="h-full w-full rounded-lg"
							frameborder="0"
							allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
							allowfullscreen
							title="Video Player"
						></iframe>
					{:else}
						<div class="flex h-full items-center justify-center rounded-lg bg-gray-100">
							<p class="text-gray-600">Video player not available</p>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Video Details -->
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<h4 class="font-medium text-gray-900">Video Details</h4>
					<dl class="mt-2 space-y-1">
						<div class="flex justify-between">
							<dt class="text-gray-600">Title:</dt>
							<dd class="font-medium">{selectedVideo.title || 'Untitled'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-gray-600">Duration:</dt>
							<dd>{selectedVideo.durationFormatted || '-'}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-gray-600">File Size:</dt>
							<dd>{selectedVideo.fileSizeMB} MB</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-gray-600">Status:</dt>
							{#if selectedVideo.status}
								{@const statusInfo = getStatusBadge(selectedVideo.status)}
								<dd>
									<Badge color={statusInfo.color} class="text-xs">{statusInfo.text}</Badge>
								</dd>
							{:else}
								<dd>Unknown</dd>
							{/if}
						</div>
					</dl>
				</div>
				<div>
					<h4 class="font-medium text-gray-900">Uploader Info</h4>
					<dl class="mt-2 space-y-1">
						<div class="flex justify-between">
							<dt class="text-gray-600">Name:</dt>
							<dd class="font-medium">{selectedVideo.userName}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-gray-600">Email:</dt>
							<dd>{selectedVideo.userEmail}</dd>
						</div>
						{#if selectedVideo.instagramHandle}
							<div class="flex justify-between">
								<dt class="text-gray-600">Instagram:</dt>
								<dd class="text-blue-600">{selectedVideo.instagramHandle}</dd>
							</div>
						{/if}
						<div class="flex justify-between">
							<dt class="text-gray-600">Uploaded:</dt>
							<dd>{formatUploadDate(selectedVideo.uploadDate)}</dd>
						</div>
					</dl>
				</div>
			</div>

			{#if selectedVideo.aiDescription}
				<div>
					<h4 class="font-medium text-gray-900">AI Generated Description</h4>
					<p class="mt-1 text-sm text-gray-600">{selectedVideo.aiDescription}</p>
				</div>
			{/if}
		</div>
	{/if}

	<svelte:fragment slot="footer">
		{#if selectedVideo}
			<div class="flex gap-2">
				<Button color="green" onclick={() => downloadVideo(selectedVideo)}>Download Video</Button>
				<Button color="alternative" onclick={() => (showVideoModal = false)}>Close</Button>
			</div>
		{/if}
	</svelte:fragment>
</Modal>
