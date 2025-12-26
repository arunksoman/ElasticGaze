<script lang="ts">
	import { onMount } from 'svelte';
	import { Modal } from '$lib/components/ui/modalComponents';
	import ConnectionForm from '$lib/components/app/ConnectionForm.svelte';
	import { HasDefaultConfig } from '$lib/wailsjs/go/main/App';

	let showConnectionModal = $state(false);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			// Check if there's a default configuration
			const hasDefault = await HasDefaultConfig();
			console.log('Has default config:', hasDefault);
			
			// Show modal if no default connection exists
			if (!hasDefault) {
				console.log('No default config found, showing modal');
				// Use setTimeout to ensure DOM is ready
				setTimeout(() => {
					showConnectionModal = true;
				}, 100);
			}
		} catch (error) {
			console.error('Error checking default configuration:', error);
			// On error, show modal to allow configuration
			setTimeout(() => {
				showConnectionModal = true;
			}, 100);
		} finally {
			isLoading = false;
		}
	});

	function handleConnectionSaved() {
		showConnectionModal = false;
	}

	function handleConnectionCancel() {
		// For home page, we might want to keep the modal open if no default exists
		// But allow closing if user really wants to
		showConnectionModal = false;
	}
</script>

{#if !isLoading}
	<div class="max-w-6xl ml-4 mt-4">
		<h1 class="text-2xl font-bold text-(--color-base-content)">Dashboard</h1>
		
		{#if showConnectionModal}
			<p class="mt-4 text-(--color-base-content) opacity-70">
				Welcome! Please configure your first Elasticsearch connection to get started.
			</p>
		{/if}
	</div>
{/if}

<!-- Connection Modal -->
<Modal
	bind:open={showConnectionModal}
	title="Add New Connection"
	size="xl"
	closable={true}
	centered={true}
>
	<ConnectionForm
		onSave={handleConnectionSaved}
		onCancel={handleConnectionCancel}
	/>
</Modal>
