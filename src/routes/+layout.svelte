<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import MatterView from '$lib/components/MatterView.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MatterView />

{@render children?.()}
