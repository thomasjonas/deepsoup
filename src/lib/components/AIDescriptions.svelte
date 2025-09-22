<script lang="ts">
	import AiDescription from './AIDescription.svelte';

	let { description, onComplete }: { description: string; onComplete: () => void } = $props();

	let descriptions = $derived.by(() => {
		const items = description.match(/^- .+/gm);
		if (!items) return [];
		return items.map((i) => i.replace('- ', '').trim());
	});

	let completed = 0;
	function onCompleted() {
		completed++;
		if (completed >= descriptions.length) onComplete();
	}
</script>

<div class="pointer-events-none fixed inset-0">
	<div class="relative h-full w-full overflow-hidden">
		{#each descriptions as description, index}
			<AiDescription text={description} {index} onComplete={onCompleted} />
		{/each}
	</div>
</div>
