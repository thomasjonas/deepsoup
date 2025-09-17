<script lang="ts">
	import { page } from '$app/state';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';
	import { onDestroy } from 'svelte';
	import Marquee from 'svelte-fast-marquee';

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

	let rectSize = $state({
		width: 0,
		height: 0
	});
	$effect(() => {
		const { width, height } = rectSize;

		RectangleLayout.addExclusion({ id: 'top', x: 0, y: 0, w: width, h: height });
	});
</script>

<div
	class="ui-text lg pointer-events-none absolute top-0 z-[102] flex w-screen items-start px-3.5 pt-2.5 pb-4 leading-tight lg:px-8 lg:pt-4"
	bind:clientWidth={rectSize.width}
	bind:clientHeight={rectSize.height}
>
	<h1 class="lg:-pl-8 -ml-3.5 min-w-0 flex-1 pr-4">
		<div class="w-full overflow-hidden">
			<Marquee play speed={texts.join('').length / 10}>
				{#each texts as t}
					<div class="pl-3.5 lg:pl-8">{t}</div>
					<div
						class=" top-[0.2em] right-0 -mr-1.5 ml-2 aspect-square h-[0.8em] rounded-full bg-black lg:-mr-6"
					></div>
				{/each}
			</Marquee>
		</div>
	</h1>

	{#if page.url.pathname !== '/info'}
		<a
			href="/info"
			class=" pointer-events-auto shrink-0 underline decoration-2 underline-offset-3 lg:decoration-3 lg:underline-offset-4"
			>Info</a
		>
	{/if}
</div>
