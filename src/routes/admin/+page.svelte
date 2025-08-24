<script lang="ts">
	import {
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge
	} from 'flowbite-svelte';
	import { formatDistanceToNow } from 'date-fns';
	import type { PageData } from './$types';

	export let data: PageData;

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
</script>

<svelte:head>
	<title>Admin Dashboard - Video Upload Platform</title>
</svelte:head>

<div class="space-y-6">
	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Card class="p-6">
			<div class="flex items-center">
				<div class="flex-1">
					<h3 class="text-lg font-medium text-gray-900">Total Videos</h3>
					<p class="mt-2 text-3xl font-bold text-blue-600">{data.stats.totalVideos}</p>
				</div>
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
						<svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Card>
	</div>

	<!-- Recent Videos Table -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-medium text-gray-900">Recent Uploads</h2>
			<a href="/admin/videos" class="text-sm font-medium text-blue-600 hover:text-blue-500">
				View all →
			</a>
		</div>

		{#if data.recentVideos.length > 0}
			<div class="overflow-x-auto">
				<Table hoverable={true}>
					<TableHead>
						<TableHeadCell>Title</TableHeadCell>
						<TableHeadCell>Uploader</TableHeadCell>
						<TableHeadCell>Duration</TableHeadCell>
						<TableHeadCell>Size</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Uploaded</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each data.recentVideos as video (video.id)}
							<TableBodyRow>
								<TableBodyCell>
									<div class="max-w-xs truncate font-medium text-gray-900">
										{video.title || 'Untitled Video'}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="text-sm text-gray-900">
										{video.userName}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="text-sm text-gray-600">
										{video.durationFormatted || '-'}
									</div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="text-sm text-gray-600">
										{video.fileSizeMB} MB
									</div>
								</TableBodyCell>
								<TableBodyCell>
									{@const statusInfo = getStatusBadge(video.status)}
									<Badge color={statusInfo.color}>{statusInfo.text}</Badge>
								</TableBodyCell>
								<TableBodyCell>
									<div class="text-sm text-gray-600">
										{formatUploadDate(video.uploadDate)}
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
	</div>
</div>
