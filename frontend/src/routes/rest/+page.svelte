<script lang="ts">
	import { onMount } from 'svelte';
	import { SecondarySidebar, SecondarySidebarToggle, RequestTab, restStore } from '$lib/components/ui/restComponents';
	import { GetDefaultConfig, EnsureDefaultCollection } from '$lib/wailsjs/go/main/App';
	import { showToast } from '$lib/components/ui/toastComponent';
	import { sidebarExpanded } from '$lib/components/ui/sideBarComponents/sidebar';

	const storeState = $derived($restStore);
	const sidebarState = $derived($sidebarExpanded);

	onMount(async () => {
		// Load default config
		try {
			const config = await GetDefaultConfig();
			restStore.setDefaultConfigId(config.id);
		} catch (error: any) {
			console.error('No default config found:', error);
			showToast({
				type: 'warning',
				message: 'No default connection',
				description: 'Please configure a connection in settings'
			});
		}

		// Ensure at least one collection exists
		try {
			await EnsureDefaultCollection();
		} catch (error: any) {
			console.error('Failed to ensure default collection:', error);
		}

		// Create a default tab if none exist
		if (storeState.activeTabs.length === 0) {
			restStore.createTab({ name: 'New Request', method: 'GET', url: '/' });
		}
	});
</script>

<!-- Secondary Sidebar Toggle (shows when sidebar is closed) -->
<SecondarySidebarToggle />

<!-- Secondary Sidebar (Collections Tree) -->
<SecondarySidebar />

<!-- Main Content -->
<div 
	class="rest-page fixed top-7 right-0 bottom-0 transition-all duration-300"
	style="left: {sidebarState ? (storeState.secondarySidebarOpen ? '500px' : '220px') : (storeState.secondarySidebarOpen ? '336px' : '56px')};"
>
	<RequestTab />
</div>

<style>
	.rest-page {
		background: var(--color-base-100);
	}
</style>