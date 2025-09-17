<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { DownloadSolid, TrashBinSolid } from 'flowbite-svelte-icons';

	let {
		downloadLink,
		onRemove
	}: {
		downloadLink: string;
		onRemove: () => void;
	} = $props();
</script>

<div class="text-right">
	<Button color="blue" size="xs" download href={downloadLink}><DownloadSolid size="sm" /></Button>
	<Button color="red" size="xs" onclick={onRemove}><TrashBinSolid size="sm" /></Button>
</div>
