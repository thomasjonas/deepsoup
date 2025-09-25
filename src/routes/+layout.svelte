<script lang="ts">
	import { dev } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

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
