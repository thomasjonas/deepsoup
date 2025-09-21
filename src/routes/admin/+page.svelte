<script lang="ts">
	import VideosTable from '$lib/components/admin/VideosTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Admin Dashboard - Video Upload Platform</title>
</svelte:head>

<div class="space-y-6">
	<VideosTable videos={data.videos} />
</div>
