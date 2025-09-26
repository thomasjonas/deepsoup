<script lang="ts">
	import Hls from 'hls.js';
	import { onMount } from 'svelte';

	let video: HTMLVideoElement;

	onMount(() => {
		var videoSrc =
			'https://vz-0f9b0bdb-8c7.b-cdn.net/6825f6a3-19c1-455e-bfdd-49a7c9e02d7a/playlist.m3u8';
		if (Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(videoSrc);
			hls.attachMedia(video);
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = videoSrc;
		}
	});
</script>

<video
	class="pointer-events-auto aspect-[3200/1800] h-auto w-full"
	bind:this={video}
	controls
	playsinline
	poster="/teaser-poster.jpg"
>
</video>
