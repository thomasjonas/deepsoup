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

	function downloadHandler(e: Event) {
		e.stopPropagation();
	}
	function removeHandler(e: Event) {
		e.stopPropagation();
		onRemove();
	}
</script>

<div class="text-right">
	<Button color="blue" size="xs" download href={downloadLink} onclick={downloadHandler}
		><DownloadSolid size="sm" /></Button
	>
	<Button color="red" size="xs" onclick={removeHandler}><TrashBinSolid size="sm" /></Button>
</div>
