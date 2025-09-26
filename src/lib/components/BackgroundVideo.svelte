<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Hls from 'hls.js';

	let { isPlaying } = $props();
	let isUnlocked = $state(false);

	let video: HTMLVideoElement;

	onMount(() => {
		var videoSrc =
			'https://vz-0f9b0bdb-8c7.b-cdn.net/b6fccd71-0a11-40c3-b436-120e42ea1dd0/playlist.m3u8';
		if (Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(videoSrc);
			hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = videoSrc;
		}
	});

	let pauseTimeout: NodeJS.Timeout;
	$effect(() => {
		clearTimeout(pauseTimeout);
		if (isPlaying) {
			video.currentTime = 0;
			video.play();
		} else {
			pauseTimeout = setTimeout(() => {
				video.pause();
			}, 1000);
		}
	});

	async function unlockVideo() {
		if (!video || isUnlocked) return;
		isUnlocked = true;
		video.play();
		if (!isPlaying) {
			await tick();
			video.pause();
		}
	}
</script>

<svelte:head>
	{#if isPlaying}
		<meta name="theme-color" content="#72B286" />
	{/if}
</svelte:head>

<svelte:window ontouchstart={unlockVideo} />

<div
	class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-1000"
	class:opacity-100={isPlaying}
>
	<video class="h-full w-full object-cover" bind:this={video} playsinline muted loop></video>
</div>
