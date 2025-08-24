<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import VideosTable from '$lib/components/VideosTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin Dashboard - Video Upload Platform</title>
</svelte:head>

<div class="space-y-6">
	<!-- Videos Table -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-lg font-medium text-gray-900">Videos</h1>
		</div>

		{#if data.videos.length > 0}
			<VideosTable videos={data.videos} />
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
