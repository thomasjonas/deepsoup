<script lang="ts">
	import MetaForm from '$lib/components/MetaForm.svelte';
</script>

<div class="p-5">
	<MetaForm
		video={{ id: 'asd', duration: 0, size: 0, description: '', filename: 'asd' }}
		onError={() => {}}
		restart={() => {}}
	/>
</div>
