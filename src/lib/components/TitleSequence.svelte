<script lang="ts">
	import { page } from '$app/state';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';
	import { appContent, topState } from '$lib/state.svelte';
	import Marquee from 'svelte-fast-marquee';

	let texts = $derived(appContent.topbar ? appContent.topbar.split('\n') : []);

	let rectSize = $state({
		width: 0,
		height: 0
	});

	$effect(() => {
		const { width, height } = rectSize;
		topState.set({ x: 0, y: 0, width, height });
		RectangleLayout.addExclusion({
			id: 'top',
			x: 0,
			y: 0,
			w: width,
			h: height
		});
	});
</script>

<div
	class="ui-text lg pointer-events-none flex w-screen items-start px-3.5 pt-2.5 pb-3 leading-tight lg:px-4 lg:pt-4 lg:pb-4"
	bind:clientWidth={rectSize.width}
	bind:clientHeight={rectSize.height}
>
	<h1 class="lg:-pl-8 -ml-3.5 min-w-0 flex-1 pr-4">
		<div class="w-full overflow-hidden">
			{#if texts.length > 0}
				<Marquee play speed={texts.join('').length / 10}>
					{#each texts as t}
						<div class="pl-3.5 lg:pl-8">{t}</div>
						<div
							class=" top-[0.2em] right-0 -mr-1.5 ml-2 aspect-square h-[0.8em] rounded-full bg-black lg:-mr-6"
						></div>
					{/each}
				</Marquee>
			{/if}
		</div>
	</h1>

	<a
		href={page.url.pathname === '/info' ? '/' : '/info'}
		class=" pointer-events-auto shrink-0 underline decoration-2 underline-offset-3 lg:decoration-3 lg:underline-offset-4"
		>{page.url.pathname === '/info' ? 'Close' : 'Info'}</a
	>
</div>
