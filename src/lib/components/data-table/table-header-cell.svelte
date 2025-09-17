<script lang="ts">
	import { ArrowUpDownOutline } from 'flowbite-svelte-icons';

	let { sortable, text, toggleSort } = $props();
</script>

{#if sortable}
	<button
		onclick={toggleSort}
		class="relative -mx-2 -my-1 flex gap-1 rounded-sm px-2 py-1 uppercase hover:bg-gray-100"
	>
		{text}
		<ArrowUpDownOutline size="sm" class="" />
	</button>
{:else}
	{text}
{/if}
