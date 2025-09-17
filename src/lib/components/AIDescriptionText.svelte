<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div
	class="ai-description pointer-events-none absolute max-w-[300px] text-center text-[27px] leading-[1] text-white lg:max-w-[550px] lg:text-[60px] 2xl:max-w-[700px]"
>
	{text}
</div>
