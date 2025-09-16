<script lang="ts">
	let { content } = $props();
</script>

<div class="fixed left-0 z-[101] h-full w-screen overflow-y-scroll bg-green p-5">
	<a href="/" class="ui-text absolute top-0 right-2 p-2">X</a>
	<div class="info-content body-text mx-auto pt-10 pb-2 leading-snug lg:max-w-[740px]">
		{@html content}
	</div>
</div>
