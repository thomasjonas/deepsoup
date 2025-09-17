<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';

	let { children } = $props();

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	$effect(() => {
		RectangleLayout.setContainerSize(windowWidth, windowHeight);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

{@render children?.()}
