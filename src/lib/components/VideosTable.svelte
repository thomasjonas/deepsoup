<script lang="ts">
	import { Table } from '@flowbite-svelte-plugins/datatable';
	import { Button, Datepicker } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import type { DataTableOptions } from 'simple-datatables';

	type Video = {
		id: number;
		title: string | null;
		userName: string;
		uploadDate: string | null;
		status: string;
		durationFormatted: string | null;
		fileSizeMB: number;
	};

	let { videos } = $props<{ videos: Video[] }>();

	let dateRange = $state({
		from: undefined as Date | undefined,
		to: undefined as Date | undefined
	});

	let options: DataTableOptions = $state({
		data: {
			headings: [
				'ID',
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
			{ select: 1, sortable: true }, // title
			{ select: 2, sortable: true, type: 'string' }, // userName
			{ select: 3, sortable: false }, // duration
			{ select: 4, sortable: false }, // size
			{ select: 5, sortable: false }, // status
			{ select: 6, sortable: true, type: 'date', format: 'MM/DD/YYYY' }, // uploadDate
			{
				select: 7,
				sortable: false,
				cellRender: (data: any) => {
					const videoId = data.cell.childNodes[0].data;
					return `<a href="/admin/content/${videoId}" class="text-blue-500 hover:underline">Details</a>`;
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
			video.title || 'Untitled Video',
			video.userName,
			video.durationFormatted || '-',
			`${video.fileSizeMB} MB`,
			video.status,
			video.uploadDate ? new Date(video.uploadDate).toLocaleDateString() : '-',
			video.id
		]);

		options.data.data = newData;
	});
</script>

<div class="rounded-lg bg-white p-4 dark:bg-gray-800">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Videos</h3>
			<span class="text-base font-normal text-gray-500 dark:text-gray-400"
				>Browse and manage your video content.</span
			>
		</div>
		<div class="flex items-center space-x-3">
			<Button href="/admin/content">
				<PlusOutline class="mr-2 h-3.5 w-3.5" />
				Upload Video
			</Button>
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

	<Table dataTableOptions={options} selectable={true} />
</div>
