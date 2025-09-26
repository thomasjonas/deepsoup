<script lang="ts">
	import { dev } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';
	import { page } from '$app/state';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	$effect(() => {
		RectangleLayout.setContainerSize(windowWidth, windowHeight);
	});

	const TITLE = 'DEEP SOUP – a continuously updated participatory film';
	const DESCRIPTION =
		'DEEP SOUP uses video contributions from people worldwide, fed to a new physical intelligence model.';
	const ORIGIN = page.url.origin;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />

	<link rel="apple-touch-icon" sizes="57x57" href="/favicon-57x57.png" />
	<link rel="apple-touch-icon" sizes="60x60" href="/favicon-60x60.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png" />
	<link rel="apple-touch-icon" sizes="76x76" href="/favicon-76x76.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="/favicon-114x114.png" />
	<link rel="apple-touch-icon" sizes="120x120" href="/favicon-120x120.png" />
	<link rel="apple-touch-icon" sizes="144x144" href="/favicon-144x144.png" />
	<link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
	<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />

	<!-- Open Graph (Facebook, LinkedIn, WhatsApp, etc.) -->
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content="{ORIGIN}/og-image.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="DEEP SOUP" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content="{ORIGIN}/og-image.png" />
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

{@render children?.()}
