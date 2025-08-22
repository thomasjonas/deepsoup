<script lang="ts">
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		VideoCameraSolid,
		CogSolid,
		HomeOutline,
		UsersSolid,
		DocumentTextSolid
	} from 'flowbite-svelte-icons';

	// Get current page for active navigation
	$: activeUrl = $page.url.pathname;
</script>

<svelte:head>
	<title>Admin Dashboard - Video Upload Platform</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar class="h-screen w-64">
		<SidebarWrapper>
			<SidebarGroup>
				<div class="border-b border-gray-200 p-4">
					<h2 class="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
				</div>

				<SidebarItem label="Overview" href="/admin" active={activeUrl === '/admin'}>
					<svelte:fragment slot="icon">
						<HomeOutline class="h-5 w-5" />
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem
					label="Videos"
					href="/admin/videos"
					active={activeUrl.startsWith('/admin/videos')}
				>
					<svelte:fragment slot="icon">
						<VideoCameraSolid class="h-5 w-5" />
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem
					label="Content Management"
					href="/admin/content"
					active={activeUrl.startsWith('/admin/content')}
				>
					<svelte:fragment slot="icon">
						<DocumentTextSolid class="h-5 w-5" />
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Main Content -->
	<div class="flex-1 p-8">
		<div class="mx-auto max-w-7xl">
			<slot />
		</div>
	</div>
</div>
