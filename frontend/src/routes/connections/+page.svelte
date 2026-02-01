<script lang="ts">
	import { onMount } from 'svelte';
	import { Modal } from 'chathuram/modal';
	import { Button } from 'chathuram/form';
	import ConnectionForm from '$lib/components/app/ConnectionForm.svelte';
	import ConnectionCard from '$lib/components/app/ConnectionCard.svelte';
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import { GetAllConfigs } from '$lib/wailsjs/go/main/App';
	
	import { page } from '$app/stores';

	let showConnectionModal = $state(false);
	let connections = $state<any[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		await loadConnections();
	});

	async function loadConnections() {
		try {
			isLoading = true;
			const configs = await GetAllConfigs();
			connections = configs || [];
		} catch (error) {
			console.error('Error loading connections:', error);
		} finally {
			isLoading = false;
		}
	}

	function openConnectionModal() {
		showConnectionModal = true;
	}

	async function handleConnectionSaved() {
		showConnectionModal = false;
		await loadConnections();
	}

	function handleConnectionCancel() {
		showConnectionModal = false;
	}
</script>

<div class="relative">
	<div class="absolute top-4 right-4 z-10">
		<Button variant="primary" icon="Plus" onclick={openConnectionModal}>
			Add Connection
		</Button>
	</div>
</div>

<div class="max-w-6xl ml-4 mt-4">
	<h1 class="text-2xl font-bold mb-6">Connections</h1>
	
	<DefaultConnectionMessage currentPath={$page.url.pathname} />

	{#if isLoading}
		<p class="text-(--color-base-content) opacity-70">Loading connections...</p>
	{:else if connections.length === 0}
		<p class="text-(--color-base-content) opacity-70">No connections configured yet.</p>
	{:else}
		<div class="connections-grid">
			{#each connections as connection (connection.id)}
				<ConnectionCard
					{connection}
					onUpdate={loadConnections}
					onDelete={loadConnections}
				/>
			{/each}
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
</div>

<style>
	.connections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	
	@media (min-width: 640px) {
		.connections-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	
	@media (min-width: 1024px) {
		.connections-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.mb-6 {
		margin-bottom: 1.5rem;
	}
</style>