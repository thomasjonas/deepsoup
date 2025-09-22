<script lang="ts">
	import { Card, Button, Textarea, Alert } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { formatDistanceToNow } from 'date-fns';
	import type { PageData, ActionData } from './$types';
	import Wysiwyg from '$lib/components/admin/Wysiwyg.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Form states
	let colophonContent = $state(data.content?.colophon.content);
	let screeningDatesContent = $state(data.content?.screening_dates.content);
	let promptContent = $state(data.content?.prompt.content);
	let topbarContent = $state(data.content?.topbar.content);
	let isSubmitting = $state(false);
	let activeForm = $state<string | null>(null);

	// Handle form submission
	function handleSubmit(key: string) {
		return ({ formElement, submitter, cancel }: any) => {
			isSubmitting = true;
			activeForm = key;

			return async ({ result, update }: any) => {
				isSubmitting = false;
				activeForm = null;
				await update();
				if (key === 'screening_dates') screeningDatesContent = result.data.content;
				if (key === 'prompt') promptContent = result.data.content;
				if (key === 'colophon') colophonContent = result.data.content;
				if (key === 'topbar') topbarContent = result.data.content;
			};
		};
	}

	// Format last updated date
	function formatLastUpdated(dateString: string | null) {
		if (!dateString) return 'Never updated';
		const date = new Date(dateString);
		return `Last updated ${formatDistanceToNow(date, { addSuffix: true })}`;
	}
</script>

<svelte:head>
	<title>Content Management - Admin Dashboard</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-bold text-2xl text-gray-900">Content Management</h1>
			<p class="mt-1 text-sm text-gray-600">
				Edit site content, including colophon text and screening dates
			</p>
		</div>
		<div class="flex gap-4">
			<a
				href="/admin"
				class="font-medium inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				← Back to Dashboard
			</a>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<Alert color="green" dismissable>
			<span class="font-medium">Success!</span>
			{form.message || 'Content updated successfully'}
		</Alert>
	{:else if form?.error}
		<Alert color="red" dismissable>
			<span class="font-medium">Error:</span>
			{form.error}
		</Alert>
	{/if}

	<!-- Colophon Content -->
	<Card class="p-6" size="lg">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-medium text-lg text-gray-900">Colophon</h2>
					<p class="text-sm text-gray-600">Credits, acknowledgments, and project information</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content!.colophon.updatedAt)}
				</div>
			</div>

			<form
				method="POST"
				action="?/updateContent"
				use:enhance={handleSubmit('colophon')}
				class="space-y-4"
			>
				<input type="hidden" name="key" value="colophon" />

				<div>
					<input type="hidden" name="content" bind:value={colophonContent} required />
					<Wysiwyg bind:value={colophonContent} />
				</div>

				<div class="flex justify-end">
					<Button type="submit" color="blue" disabled={isSubmitting && activeForm === 'colophon'}>
						{#if isSubmitting && activeForm === 'colophon'}
							Saving...
						{:else}
							Save Colophon
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</Card>

	<!-- Screening Dates Content -->
	<!-- <Card class="p-6" size="lg">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-medium text-lg text-gray-900">Screening Dates</h2>
					<p class="text-sm text-gray-600">Information about upcoming screening events</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content!.screening_dates.updatedAt)}
				</div>
			</div>

			<form
				method="POST"
				action="?/updateContent"
				use:enhance={handleSubmit('screening_dates')}
				class="space-y-4"
			>
				<input type="hidden" name="key" value="screening_dates" />

				<div>
					<Textarea
						name="content"
						bind:value={screeningDatesContent}
						rows={6}
						placeholder="Enter screening dates and information here..."
						class="w-full"
						required
					/>
				</div>

				<div class="flex justify-end">
					<Button
						type="submit"
						color="blue"
						disabled={isSubmitting && activeForm === 'screening_dates'}
					>
						{#if isSubmitting && activeForm === 'screening_dates'}
							Saving...
						{:else}
							Save Screening Dates
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</Card> -->

	<Card class="p-6" size="lg">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-medium text-lg text-gray-900">Title ticker</h2>
					<p class="text-sm text-gray-600">Information ticker in the top bar of the website.</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content!.topbar.updatedAt)}
				</div>
			</div>

			<form
				method="POST"
				action="?/updateContent"
				use:enhance={handleSubmit('topbar')}
				class="space-y-4"
			>
				<input type="hidden" name="key" value="topbar" />

				<div>
					<Textarea
						name="content"
						bind:value={topbarContent}
						rows={6}
						placeholder="Enter title ticker content here..."
						class="w-full"
						required
					/>
				</div>

				<div class="flex justify-end">
					<Button type="submit" color="blue" disabled={isSubmitting && activeForm === 'topbar'}>
						{#if isSubmitting && activeForm === 'topbar'}
							Saving...
						{:else}
							Save Title Ticker
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</Card>

	<Card class="p-6" size="lg">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="font-medium text-lg text-gray-900">Analyze Prompt</h2>
					<p class="text-sm text-gray-600">Prompt to use for analyzing user submitted video</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content!.prompt.updatedAt)}
				</div>
			</div>

			<form
				method="POST"
				action="?/updateContent"
				use:enhance={handleSubmit('prompt')}
				class="space-y-4"
			>
				<input type="hidden" name="key" value="prompt" />

				<div>
					<Textarea
						name="content"
						bind:value={promptContent}
						rows={6}
						placeholder="Enter prompt..."
						class="w-full"
						required
					/>
				</div>

				<div class="flex justify-end">
					<Button type="submit" color="blue" disabled={isSubmitting && activeForm === 'prompt'}>
						{#if isSubmitting && activeForm === 'prompt'}
							Saving...
						{:else}
							Save Prompt
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</Card>
</div>
