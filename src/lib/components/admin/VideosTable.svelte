<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_BUNNY_STORAGE_ZONE_NAME } from '$env/static/public';
	import { type getAllVideos } from '$lib/server/db/videos';
	import type { ColumnDef, Row } from '@tanstack/table-core';
	import dayjs from 'dayjs';
	import { Card } from 'flowbite-svelte';
	import { createRawSnippet } from 'svelte';
	import { headerComponent, renderComponent, renderSnippet } from './data-table/render-helpers';
	import TableActions from './data-table/table-actions.svelte';
	import TanstackTable from './TanstackTable.svelte';
	import VideoModal from './VideoModal.svelte';

	type Video = Awaited<ReturnType<typeof getAllVideos>>[0];

	let { videos } = $props<{ videos: Video[] }>();

	let selectedVideo: Video | undefined = $derived.by(() => {
		const hash = page.url.hash;
		if (hash.startsWith('#video-')) {
			const videoId = parseInt(hash.substring(7), 10);
			if (!isNaN(videoId)) return videos.find((v: Video) => v.id === videoId);
		}
		return;
	});

	$effect(() => {
		if (!selectedVideo && page.url.hash.startsWith('#video-')) window.location.hash = '';
	});

	const columns: ColumnDef<Video>[] = [
		{
			accessorKey: 'bunnyVideoId',
			header: 'Thumbnail',
			cell: ({ row }) =>
				renderSnippet(
					createRawSnippet<[string]>(() => {
						return {
							render: () =>
								`<img class="aspect-square object-contain h-12 -my-4 w-auto" src="https://${PUBLIC_BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/${row.original.bunnyVideoId}/thumbnail.jpg" />`
						};
					})
				),
			enableSorting: false
		},
		{
			accessorKey: 'originalFilename',
			header: (ctx) => headerComponent('Filename', ctx)
		},
		{
			accessorKey: 'userName',
			header: (ctx) => headerComponent('Uploader', ctx)
		},
		{
			accessorKey: 'durationFormatted',
			header: (ctx) => headerComponent('Duration', ctx)
		},
		{
			accessorKey: 'fileSizeMB',
			header: (ctx) => headerComponent('Size', ctx),
			cell: (ctx) => {
				return `${ctx.getValue()} MB`;
			}
		},
		{
			accessorKey: 'uploadDate',
			header: (ctx) => headerComponent('Uploaded', ctx),
			cell: (ctx) => {
				const time = ctx.getValue() as string;
				return dayjs(time).format('MMMM D, YYYY HH:mm');
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				return renderComponent(TableActions, {
					downloadLink: `/download/${row.original.bunnyVideoId}?filename=${row.original.originalFilename}`,
					onRemove: () => removeHandler(row.original)
				});
			}
		}
	];

	async function removeHandler(video: Video) {
		const confirmation = confirm(`Are you sure you want to remove video ${video.title}?`);
		if (!confirmation) return;

		await fetch(`/api/delete-video/${video.id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<Card size="xl" class="max-w-none p-4 shadow-sm sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="font-semibold text-xl text-gray-900 dark:text-white">Videos</h3>
			<span class="font-normal text-base text-gray-500 dark:text-gray-400"
				>Browse and manage your video content.</span
			>
		</div>
	</div>

	<TanstackTable
		data={videos}
		{columns}
		onRowClick={(row: Row<Video>) => (selectedVideo = row.original)}
	/>
</Card>

<VideoModal
	video={selectedVideo}
	onClose={() => (selectedVideo = undefined)}
	onRemove={() => selectedVideo && removeHandler(selectedVideo)}
/>
