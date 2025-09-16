<script lang="ts">
	import { page } from '$app/state';
	import InfoPage from '$lib/components/InfoPage.svelte';
	import MatterView from '$lib/components/MatterView.svelte';
	import { appContent } from '$lib/state.svelte';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	let showInfoPage = $derived(page.url.pathname === '/info');

	$effect(() => {
		appContent.colophon = data.colophon;
		appContent.prompt = data.prompt;
	});
</script>

{#if showInfoPage}
	<InfoPage content={data.colophon} />
{/if}

<MatterView />

{@render children?.()}
