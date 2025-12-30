<script lang="ts">
	import { onMount } from 'svelte';
	import { Modal } from '$lib/components/ui/modalComponents';
	import { Button } from '$lib/components/ui/formComponents';
	import ConnectionForm from '$lib/components/app/ConnectionForm.svelte';
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import { GetAllConfigs } from '$lib/wailsjs/go/main/App';
	import { Plus } from '@icon-park/svg';
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

<div class="max-w-6xl ml-4 mt-4">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Connections</h1>
		<Button variant="primary" onclick={openConnectionModal}>
			{@html Plus({ theme: 'outline', size: '16', strokeWidth: 3 })}
			Add Connection
		</Button>
	</div>
	
	<DefaultConnectionMessage currentPath={$page.url.pathname} />

	{#if isLoading}
		<p class="text-(--color-base-content) opacity-70">Loading connections...</p>
	{:else if connections.length === 0}
		<p class="text-(--color-base-content) opacity-70">No connections configured yet.</p>
	{:else}
		<div class="connections-grid">
			{#each connections as connection}
				<div
					class="connection-card p-4 rounded-lg"
					style="
						background-color: var(--color-base-200);
						border: var(--border) solid var(--color-base-300);
						border-top: 4px solid {connection.env_indicator_color || '#3b82f6'};
					"
				>
					<div class="flex justify-between items-start">
						<div>
							<h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
								{connection.connection_name}
							</h3>
							<p class="text-sm" style="color: var(--color-base-content); opacity: 0.7;">
								{connection.host}:{connection.port}
							</p>
							{#if connection.set_as_default}
								<span
									class="text-xs px-2 py-1 rounded mt-2 inline-block"
									style="
										background-color: var(--color-accent);
										color: var(--color-accent-content);
									"
								>
									Default
								</span>
							{/if}
						</div>
					</div>
				</div>
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
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.flex {
		display: flex;
	}

	.justify-between {
		justify-content: space-between;
	}

	.items-center {
		align-items: center;
	}

	.items-start {
		align-items: flex-start;
	}

	.mb-6 {
		margin-bottom: 1.5rem;
	}
</style>
