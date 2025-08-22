<script lang="ts">
	import { Card, Button, Textarea, Alert } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { formatDistanceToNow } from 'date-fns';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Form states
	let colophonContent = $state(data.content.colophon.content);
	let screeningDatesContent = $state(data.content.screening_dates.content);
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
			<h1 class="text-2xl font-bold text-gray-900">Content Management</h1>
			<p class="mt-1 text-sm text-gray-600">
				Edit site content, including colophon text and screening dates
			</p>
		</div>
		<div class="flex gap-4">
			<a
				href="/admin"
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
	<Card class="p-6">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-lg font-medium text-gray-900">Colophon</h2>
					<p class="text-sm text-gray-600">Credits, acknowledgments, and project information</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content.colophon.updatedAt)}
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
					<Textarea
						name="content"
						bind:value={colophonContent}
						rows={8}
						placeholder="Enter colophon content here..."
						class="w-full"
						required
					/>
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

			<!-- Preview -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-sm font-medium text-gray-900">Preview:</h3>
				<div class="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
					{#if colophonContent.trim()}
						<div class="whitespace-pre-wrap">{colophonContent}</div>
					{:else}
						<span class="text-gray-500 italic">No content entered</span>
					{/if}
				</div>
			</div>
		</div>
	</Card>

	<!-- Screening Dates Content -->
	<Card class="p-6">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-lg font-medium text-gray-900">Screening Dates</h2>
					<p class="text-sm text-gray-600">Information about upcoming screening events</p>
				</div>
				<div class="text-xs text-gray-500">
					{formatLastUpdated(data.content.screening_dates.updatedAt)}
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

			<!-- Preview -->
			<div class="border-t pt-4">
				<h3 class="mb-2 text-sm font-medium text-gray-900">Preview:</h3>
				<div class="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
					{#if screeningDatesContent.trim()}
						<div class="whitespace-pre-wrap">{screeningDatesContent}</div>
					{:else}
						<span class="text-gray-500 italic">No content entered</span>
					{/if}
				</div>
			</div>
		</div>
	</Card>

	<!-- Usage Instructions -->
	<Card class="p-6">
		<div class="space-y-3">
			<h2 class="text-lg font-medium text-gray-900">Usage Instructions</h2>

			<div class="space-y-2 text-sm text-gray-600">
				<p>
					<strong>Colophon:</strong> This section typically contains credits, acknowledgments, production
					information, or any other details about your video project. It's often displayed at the end
					of films or on about pages.
				</p>

				<p>
					<strong>Screening Dates:</strong> Use this section to inform visitors about upcoming screening
					events, film festival dates, or any scheduled viewings of the submitted videos.
				</p>

				<p class="mt-4 text-xs text-gray-500">
					<strong>Note:</strong> All content supports line breaks and basic formatting. Changes are saved
					immediately when you click the save buttons.
				</p>
			</div>
		</div>
	</Card>
</div>
