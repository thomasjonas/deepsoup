<script lang="ts">
	import { topState } from '$lib/state.svelte';
	import DashedBox from './DashedBox.svelte';
	import InfoVideo from './InfoVideo.svelte';
	import LogoLink from './LogoLink.svelte';

	let { content } = $props();

	let top = $state(0);
	topState.subscribe((newState) => {
		top = newState.height - 5;
	});

	let blocks = $derived.by(() => {
		return content.split('<hr>');
	});
</script>

<div
	class="fixed bottom-0 left-0 z-[101] w-screen overflow-y-scroll bg-green p-5 pt-2"
	style="top: {top}px"
>
	<div class="info-content body-text mx-auto pt-2 pb-2 leading-snug lg:max-w-[740px] lg:pt-0">
		<InfoVideo />
		{#each blocks as block}
			<DashedBox class="block">
				{@html block}
			</DashedBox>
		{/each}

		<div class="flex flex-wrap items-center justify-center">
			<LogoLink link="https://filmfonds.nl" image="/logos/ff.png" name="Filmfonds" />
			<LogoLink
				link="https://studiobiarritz.nl"
				image="/logos/studio-biarritz.png"
				name="Studio Biarritz"
			/>
			<LogoLink
				link="https://stimuleringsfonds.nl"
				image="/logos/stimuleringsfonds.png"
				name="Creative Industries Fund NL"
			/>
			<LogoLink
				link="https://www.filmfestival.nl/"
				image="/logos/nff.png"
				name="Nederlands Film Festival"
			/>
			<LogoLink
				link="https://festival.idfa.nl/doclab/"
				image="/logos/idfa-doclab.png"
				name="IDFA Doclab"
			/>
		</div>
	</div>
</div>
