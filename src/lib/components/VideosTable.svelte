<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';
	// import { type getAllVideos } from '$lib/server/db/videos';
	import { Table } from '@flowbite-svelte-plugins/datatable';
	import { Button, Card, Datepicker, Modal } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import type { DataTableOptions } from 'simple-datatables';

	// type Video = Awaited<ReturnType<typeof getAllVideos>>[0];

	// let { videos } = $props<{ videos: Video[] }>();
	type Video = any;
	let videos: any[] = [];

	let dateRange = $state({
		from: undefined as Date | undefined,
		to: undefined as Date | undefined
	});

	let options: DataTableOptions = $state({
		perPage: 25,
		perPageSelect: false,
		data: {
			headings: [
				'ID',
				'Thumbnail',
				'Video Title',
				'Uploader',
				'Duration',
				'Size',
				'Status',
				'Uploaded',
				'Actions'
			],
			data: []
		},
		columns: [
			{ select: 0, hidden: true }, // id
			{
				select: 1,
				render: (data: any, cell: any, _dataIndex: number) => {
					return `<img src="${data[0].data}" class="h-10 w-auto" />`;
				}
			}, // thumbnailUrl
			{ select: 2 }, // title
			{ select: 3, type: 'string' }, // userName
			{ select: 4 }, // duration
			{ select: 5 }, // size
			{ select: 6 }, // status
			// { select: 7, type: 'date', format: 'YYYY MM' }, // uploadDate
			{ select: 7 }, // uploadDate

			{
				select: 8,
				sortable: false,
				render: (data: any, cell: any, _dataIndex: number) => {
					const videoId = data[0].data;
					return `<a href="#video-${videoId}" class="text-blue-500 hover:underline">Details</a>`;
				}
			}
		]
	});

	$effect(() => {
		const filtered = videos.filter((video: Video) => {
			if (!dateRange.from || !dateRange.to) {
				return true;
			}
			if (!video.uploadDate) return false;
			const uploadDate = new Date(video.uploadDate);
			uploadDate.setHours(0, 0, 0, 0);
			const fromDate = new Date(dateRange.from);
			fromDate.setHours(0, 0, 0, 0);
			const toDate = new Date(dateRange.to);
			toDate.setHours(0, 0, 0, 0);
			return uploadDate >= fromDate && uploadDate <= toDate;
		});

		const newData = filtered.map((video: Video) => [
			video.id,
			`https://${env.PUBLIC_BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/${video.bunnyVideoId}/thumbnail.jpg`,
			video.title || 'Untitled Video',
			video.userName,
			video.durationFormatted || '-',
			`${video.fileSizeMB} MB`,
			video.status,
			video.uploadDate,
			video.id
		]);

		options.data.data = newData;
	});

	let showModal = $state(false);

	let selectedVideo: Video | undefined = $derived.by(() => {
		const hash = page.url.hash;
		if (hash.startsWith('#video-')) {
			const videoId = parseInt(hash.substring(7), 10);
			if (!isNaN(videoId)) return videos.find((v: Video) => v.id === videoId);
		}
		return;
	});

	$effect(() => {
		const hash = page.url.hash;
		if (`#video-${selectedVideo?.id}` === hash) {
			showModal = true;
		}
	});

	$effect(() => {
		if (!showModal && page.url.hash.startsWith('#video-')) window.location.hash = '';
	});
</script>

<Card size="xl" class="max-w-none p-4 shadow-sm sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Videos</h3>
			<span class="text-base font-normal text-gray-500 dark:text-gray-400"
				>Browse and manage your video content.</span
			>
		</div>
	</div>
	<div class="mb-4 flex items-center justify-end space-x-4">
		<Datepicker
			range
			bind:rangeFrom={dateRange.from}
			bind:rangeTo={dateRange.to}
			placeholder="Filter by upload date"
		/>
	</div>

	<Table dataTableOptions={options} selectable={true} onSort={console.log} />
</Card>

{#if selectedVideo}
	<Modal title={selectedVideo?.title || 'Video Details'} bind:open={showModal} size="lg">
		<div style="position:relative;padding-top:56.25%;">
			<div class="absolute inset-0 overflow-hidden">
				<img
					alt="preview thumbnail"
					class="h-full w-full scale-105 object-cover blur-md"
					src="https://{env.PUBLIC_BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/{selectedVideo.bunnyVideoId}/thumbnail.jpg"
				/>
			</div>
			<iframe
				title={selectedVideo.title}
				src={selectedVideo.bunnyStreamUrl}
				style="border:0;position:absolute;top:0;height:100%;width:100%;"
				allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
				allowfullscreen
			></iframe>
		</div>
		<div class="space-y-2">
			<p><strong>Uploader:</strong> {selectedVideo.userName}</p>
			<p><strong>Status:</strong> {selectedVideo.status}</p>
			<p><strong>Duration:</strong> {selectedVideo.durationFormatted}</p>
			<p><strong>Size:</strong> {selectedVideo.fileSizeMB} MB</p>
			<p>
				<strong>Uploaded:</strong>
				{selectedVideo.uploadDate ? new Date(selectedVideo.uploadDate).toLocaleString() : '-'}
			</p>
		</div>
	</Modal>
{/if}
