<script lang="ts">
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import { HasDefaultConfig } from '$lib/wailsjs/go/main/App';
	import { Button } from '$lib/components/ui/formComponents';
	import { Alert } from '$lib/components/ui/alertComponent';
	
	let { currentPath = '' } = $props();
	let showMessage = $state(false);
	let isChecking = $state(true);
	
	// Pages where we don't want to show this message
	const excludedPages = ['/about', '/connections'];
	
	onMount(async () => {
		// Check if current page is excluded
		if (excludedPages.some(page => currentPath.startsWith(page))) {
			isChecking = false;
			return;
		}
		
		try {
			const hasDefault = await HasDefaultConfig();
			showMessage = !hasDefault;
		} catch (error) {
			console.error('Error checking default configuration:', error);
			// Show message on error to prompt user to configure
			showMessage = true;
		} finally {
			isChecking = false;
		}
	});
</script>

{#if !isChecking && showMessage}
	<Alert
		type="warning"
        icon="Attention"
		title="Default Connection Required"
		message="To use ElasticGaze, you need to configure a default Elasticsearch connection. Please set up your connection to start managing your Elasticsearch clusters."
	>
		{#snippet actions()}
			<Button
				variant="accent"
				size="sm"
				icon="Connection"
				onclick={() => goto('/connections')}
			>
				Configure Connection
			</Button>
		{/snippet}
	</Alert>
{/if}
