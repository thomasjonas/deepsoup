<script lang="ts">
	import AiDescriptions from '$lib/components/AIDescriptions.svelte';
	import BackgroundVideo from '$lib/components/BackgroundVideo.svelte';
	import DashedBox from '$lib/components/DashedBox.svelte';
	import MetaForm from '$lib/components/MetaForm.svelte';
	import TitleSequence from '$lib/components/TitleSequence.svelte';
	import VideoUploader from '$lib/components/VideoUploader.svelte';
	import { appState, updateBoxState } from '$lib/state.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let uploadError = $state('');
	$effect(() => {
		if (uploadError) console.error(uploadError);
	});
	let video:
		| {
				id: string;
				filename: string;
				duration: number;
				size: number;
				description: string;
		  }
		| undefined = $state();

	let boxClasses = $derived.by(() => {
		if (video) return 'px-4 py-4 w-[calc(100vw-30px)]  md:px-6 md:py-6 lg:w-[700px]';
		return 'px-6 py-3 w-[240px] lg:px-12 lg:py-6 lg:w-[700px]';
	});

	let description: string | undefined = $state();
	let isDraggedOver = $state(false);
	let showBackgroundVideo = $derived(false);
</script>

{#if description && !appState.finishedDescriptions}
	<AiDescriptions
		{description}
		onComplete={() => {
			console.log('finished descriptions');
			showBackgroundVideo = false;
			setTimeout(() => {
				appState.finishedDescriptions = true;
			}, 2000);
		}}
	/>
{/if}

<div class=" pointer-events-none absolute z-50 flex min-h-screen w-screen flex-col">
	<TitleSequence />

	<div
		class="flex flex-1 flex-col items-center justify-center opacity-100 transition-opacity delay-500 duration-1000"
	>
		<DashedBox
			onSizeChanged={updateBoxState}
			animate={showBackgroundVideo}
			class={[
				`ui-text text-center leading-tight ${boxClasses}`,
				{
					disabled: isDraggedOver,
					'bg-black text-white': isDraggedOver,
					'opacity-0':
						!appState.showLetters && !showBackgroundVideo && !appState.finishedDescriptions
				}
			]}
		>
			{#if !video}
				<VideoUploader
					onError={(message: string) => (uploadError = message)}
					onSuccess={(result: {
						id: string;
						filename: string;
						duration: number;
						size: number;
						description: string;
					}) => {
						video = result;
					}}
					onDescription={(d: string) => {
						description = d;
					}}
					onStart={() => {
						appState.showLetters = false;
						appState.finishedDescriptions = false;
						showBackgroundVideo = true;
					}}
					onDragStateChange={(newSstate) => (isDraggedOver = newSstate)}
				/>
			{:else}
				<MetaForm {video} onError={(message: string) => (uploadError = message)} />
			{/if}
		</DashedBox>
	</div>
</div>

<BackgroundVideo isPlaying={showBackgroundVideo} />
