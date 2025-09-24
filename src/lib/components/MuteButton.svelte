<script lang="ts">
	let { muted, onclick } = $props();
</script>

<button type="button" class="absolute top-4 right-4 h-8 w-8 fill-black text-black" {onclick}>
	{#if muted}
		<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
			><path
				fill="none"
				stroke="currentColor"
				stroke-linecap="square"
				stroke-miterlimit="10"
				stroke-width="32"
				d="M416 432L64 80"
			/><path
				d="M352 256c0-24.56-5.81-47.88-17.75-71.27L327 170.47 298.48 185l7.27 14.25C315.34 218.06 320 236.62 320 256a112.91 112.91 0 01-.63 11.74l27.32 27.32A148.8 148.8 0 00352 256zM416 256c0-51.19-13.08-83.89-34.18-120.06l-8.06-13.82-27.64 16.12 8.06 13.82C373.07 184.44 384 211.83 384 256c0 25.93-3.89 46.21-11 65.33l24.5 24.51C409.19 319.68 416 292.42 416 256z"
			/><path
				d="M480 256c0-74.26-20.19-121.11-50.51-168.61l-8.61-13.49-27 17.22 8.61 13.49C429.82 147.38 448 189.5 448 256c0 48.76-9.4 84-24.82 115.55l23.7 23.7C470.16 351.39 480 309 480 256zM256 72l-73.6 58.78 73.6 73.59V72zM32 176.1v159.8h93.65L256 440V339.63L92.47 176.1H32z"
			/></svg
		>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
			><path d="M157.65 176.1H64v159.8h93.65L288 440V72L157.65 176.1z" /><path
				d="M352 320c9.74-19.41 16-40.81 16-64 0-23.51-6-44.4-16-64M400 368c19.48-34 32-64 32-112s-12-77.7-32-112"
				fill="none"
				stroke="currentColor"
				stroke-linecap="square"
				stroke-linejoin="round"
				stroke-width="32"
			/></svg
		>
	{/if}
</button>
