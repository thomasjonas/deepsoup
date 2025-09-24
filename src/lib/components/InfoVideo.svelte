<script lang="ts">
	import Hls from 'hls.js';
	import { onMount } from 'svelte';
	import MuteButton from './MuteButton.svelte';

	let video: HTMLVideoElement;

	let muted = $state(true);

	onMount(() => {
		var videoSrc =
			'https://vz-0f9b0bdb-8c7.b-cdn.net/5bbcf364-69b2-4e3a-bb92-daddb9044200/playlist.m3u8';
		if (Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(videoSrc);
			hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = videoSrc;
		}
	});

	$effect(() => {
		video.muted = muted;
	});
</script>

<div class="pointer-events-auto relative">
	<MuteButton {muted} onclick={() => (muted = !muted)} />
	<video
		class="pointer-events-none aspect-[3200/1800] h-auto w-full"
		bind:this={video}
		autoplay
		playsinline
		muted
		loop
	></video>
</div>
