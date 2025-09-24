<script lang="ts">
	import { onMount } from 'svelte';
	import Hls from 'hls.js';

	let { isPlaying } = $props();

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

		if (isPlaying) video.play();
	});

	$effect(() => {
		if (isPlaying) {
			video.currentTime = 0;
			video.play();
		}
	});
</script>

<div
	class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-1000"
	class:opacity-100={isPlaying}
>
	<video class="h-full w-full object-cover" bind:this={video} autoplay playsinline muted loop
	></video>
</div>
