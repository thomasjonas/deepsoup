<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { ArrowRightToBracketOutline, FileSolid, HomeSolid } from 'flowbite-svelte-icons';

	let { data } = $props();
	let activeUrl = $state(page.url.pathname);
	$effect(() => {
		activeUrl = page.url.pathname;
	});
	let user = $derived(data.user);

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/sign-out', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				goto('/login');
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - Video Upload Platform</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar {activeUrl} position="absolute" class="z-50 h-full" params={{ x: 0, duration: 0 }}>
		<SidebarWrapper>
			<SidebarGroup>
				<h2 class="text-lg font-semibold text-gray-900">Admin Dashboard</h2>

				<SidebarItem label="Overview" href="/admin" active={activeUrl === '/admin'}>
					{#snippet icon()}
						<HomeSolid class="h-5 w-5" />
					{/snippet}
				</SidebarItem>

				<SidebarItem
					label="Content"
					href="/admin/content"
					active={activeUrl.startsWith('/admin/content')}
				>
					{#snippet icon()}
						<FileSolid class="h-5 w-5" />
					{/snippet}
				</SidebarItem>
			</SidebarGroup>

			<SidebarGroup>
				<div class="px-4 py-2 text-xs text-gray-500">
					Logged in as: {user?.email || 'Admin'}
				</div>
				<button
					onclick={handleLogout}
					class="flex w-full items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
				>
					<ArrowRightToBracketOutline class="mr-2 h-4 w-4" />
					Logout
				</button>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Main Content -->
	<div class="flex-1 p-8 px-4 md:ml-64">
		<slot />
	</div>
</div>
