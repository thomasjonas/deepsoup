<script lang="ts">
	import { topState } from '$lib/state.svelte';

	let { content } = $props();

	let top = $state(0);
	topState.subscribe((newState) => {
		top = newState.height - 5;
	});
</script>

<div
	class="fixed bottom-0 left-0 z-[101] w-screen overflow-y-scroll bg-green p-5 pt-2"
	style="top: {top}px"
>
	<div class="info-content body-text mx-auto pt-2 pb-2 leading-snug lg:max-w-[740px] lg:pt-0">
		{@html content}
	</div>
</div>
