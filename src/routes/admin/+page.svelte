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
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
			<p class="mt-1 text-sm text-gray-600">Monitor video uploads and system status</p>
		</div>
		<div class="flex gap-4">
			<a
				href="/admin/videos"
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Manage Videos
			</a>
			<a
				href="/"
				target="_blank"
				class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				View Upload Page
			</a>
		</div>
	</div>

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

		<Card class="p-6">
			<div class="flex items-center">
				<div class="flex-1">
					<h3 class="text-lg font-medium text-gray-900">Total Storage</h3>
					<p class="mt-2 text-3xl font-bold text-green-600">{data.stats.totalSize} MB</p>
				</div>
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
						<svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Card>

		<Card class="p-6">
			<div class="flex items-center">
				<div class="flex-1">
					<h3 class="text-lg font-medium text-gray-900">System Status</h3>
					<p class="mt-2 flex items-center text-lg font-semibold text-green-600">
						<span class="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
						Operational
					</p>
				</div>
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
						<svg class="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Card>
	</div>

	<!-- Recent Videos Table -->
	<Card class="p-6">
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
	</Card>
</div>
