<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authClient } from '$lib/client';

	let email = '';
	let password = '';
	let errorMessage = '';
	let loading = false;

	async function handleLogin() {
		loading = true;
		errorMessage = '';

		try {
			const { data, error } = await authClient.signIn.email({
				email,
				password
				// rememberMe: true,
				// callbackURL: $page.url.searchParams.get('redirectTo') || '/admin'
			});

			console.log($page.url.searchParams.get('redirectTo') || '/admin');

			if (data && data.user) {
				// Redirect to admin or the page they were trying to access
				const redirectTo = $page.url.searchParams.get('redirectTo') || '/admin';
				goto(redirectTo);
			} else if (error) {
				errorMessage = error.message || 'Invalid email or password';
			}
		} catch (err) {
			errorMessage = 'An error occurred. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		handleLogin();
	}
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
		</div>
		<form class="mt-8 space-y-6" on:submit={handleSubmit}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="email" class="sr-only">Email address</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						class="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Email address"
						disabled={loading}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						class="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Password"
						disabled={loading}
					/>
				</div>
			</div>

			{#if errorMessage}
				<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
					{errorMessage}
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>
		</form>
	</div>
</div>
