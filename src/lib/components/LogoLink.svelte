<script lang="ts">
	let { link, image, name } = $props();
</script>

<div class="w-1/3 px-4 pt-4 pb-2 lg:px-10 lg:pt-10 lg:pb-5">
	<a href={link} target="_blank">
		<img src={image} alt="Logo for {name}" class="mix-blend-multiply" />
	</a>
</div>
