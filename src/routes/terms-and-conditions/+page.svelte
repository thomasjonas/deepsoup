<script lang="ts">
	import DashedBox from '$lib/components/DashedBox.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-1 flex-col items-center justify-center p-5">
	<div class="info-content body-text mx-auto pt-2 pb-2 leading-snug lg:max-w-[740px] lg:pt-0">
		<DashedBox class="block">
			{@html data.terms}
		</DashedBox>
	</div>
</div>
