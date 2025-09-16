<script lang="ts">
	import AiDescriptions from '$lib/components/AIDescriptions.svelte';
	import MetaForm from '$lib/components/MetaForm.svelte';
	import TitleSequence from '$lib/components/TitleSequence.svelte';
	import VideoUploader from '$lib/components/VideoUploader.svelte';
	import { appState, updateBoxState } from '$lib/state.svelte';
	import { onMount } from 'svelte';

	let uploadError = $state('');
	$effect(() => {
		console.error(uploadError);
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

	let boxElement: HTMLDivElement;
	onMount(() => {
		const onChangeHandler = () => {
			const rect = boxElement.getBoundingClientRect();
			updateBoxState(rect);
		};

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.borderBoxSize) {
					onChangeHandler();
				}
			}
		});

		window.addEventListener('resize', onChangeHandler);
		resizeObserver.observe(boxElement);

		return () => {
			window.removeEventListener('resize', onChangeHandler);
			resizeObserver.unobserve(boxElement);
		};
	});

	let boxClasses = $derived.by(() => {
		if (video)
			return 'px-4 py-4 top-1/2 left-1/2 w-[calc(100vw-30px)] -translate-x-1/2 -translate-y-1/2 md:px-12 md:py-6 lg:w-[700px]';
		return 'px-2 py-2 top-1/2 left-1/2 w-3/5 -translate-x-1/2 -translate-y-1/2 md:px-12 md:py-6 lg:w-[700px]';
	});

	let description: string | undefined = $state();

	let isDraggedOver = $state(false);
</script>

{#if description && !appState.finishedDescriptions}
	<AiDescriptions
		{description}
		onComplete={() => {
			console.log('finished descriptions');
			appState.finishedDescriptions = true;
		}}
	/>
{/if}

<div class=" pointer-events-none absolute z-50 min-h-screen w-screen">
	<div
		class={[
			`ui-text absolute rounded-3xl border-2 border-dashed border-black text-center leading-tight ${boxClasses}`,
			{
				'border-dashed': !isDraggedOver,
				'bg-black text-white': isDraggedOver
			}
		]}
		bind:this={boxElement}
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
				}}
				onDragStateChange={(newSstate) => (isDraggedOver = newSstate)}
			/>
		{:else}
			<MetaForm {video} onError={(message: string) => (uploadError = message)} />
		{/if}
	</div>

	<TitleSequence />
</div>
