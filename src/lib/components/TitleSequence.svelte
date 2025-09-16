<script lang="ts">
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';

	const texts = [
		'DEEP SOUP the film',
		'Witness the birth of a Physical AI Model',
		'Starring: Hugo Hamlet',
		'Camera: Jasper Wolf, Thomas Weber and you',
		'Upcoming screening: 27 Nov 2025 IDFA Doclab',
		'DEEP SOUP',
		'You are the one to train it',
		'DEEP SOUP',
		'A non-human intelligence',
		'DEEP SOUP',
		'Boom! Bang! Frrrrrrriction'
	];

	let textIndex = $state(0);
	let text = $derived(texts[textIndex]);

	let timeout: NodeJS.Timeout;

	const WPM = 140;
	$effect(() => {
		const wps = 140 / 60;
		const duration = text.split(' ').length * wps;
		timeout = setTimeout(() => {
			textIndex++;
			if (textIndex > texts.length - 1) textIndex = 0;
		}, duration * 1000);
	});

	onDestroy(() => {
		if (typeof timeout !== 'undefined') clearTimeout(timeout);
	});
</script>

<div
	class="ui-text lg pointer-events-none absolute top-0 z-[102] flex w-screen items-start justify-between px-3.5 pt-2.5 leading-tight lg:px-8 lg:pt-4"
>
	<h1 class="pr-4">
		{text}
	</h1>

	{#if page.url.pathname !== '/info'}
		<a
			href="/info"
			class=" pointer-events-auto underline decoration-2 underline-offset-3 lg:decoration-3 lg:underline-offset-4"
			>Info</a
		>
	{/if}
</div>
