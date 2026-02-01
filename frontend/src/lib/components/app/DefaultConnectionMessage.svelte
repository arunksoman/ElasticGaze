<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { HasDefaultConfig, GetDefaultConfig, CheckConnection } from '$lib/wailsjs/go/main/App';
	import { Button } from 'chathuram/form';
	import { Modal } from 'chathuram/modal';
	import { toastStore } from 'chathuram/toast';
	import { CloseWifi } from '@icon-park/svg';
	import ConnectionForm from '$lib/components/app/ConnectionForm.svelte';
	
	interface Props {
		currentPath?: string;
		children?: import('svelte').Snippet;
	}
	
	let { currentPath = '', children }: Props = $props();
	let showMessage = $state(false);
	let isChecking = $state(true);
	let connectionFailed = $state(false);
	let noDefaultConfig = $state(false);
	let isRetrying = $state(false);
	let showEditModal = $state(false);
	let defaultConfig = $state<any>(null);
	let errorMessage = $state('');
	let connectionSuccessful = $state(false);
	
	// Pages where we don't want to show this message
	const excludedPages = ['/about', '/connections'];
	
	async function checkConnection() {
		isChecking = true;
		showMessage = false;
		connectionFailed = false;
		noDefaultConfig = false;
		errorMessage = '';
		
		try {
			// Check if current page is excluded
			if (excludedPages.some(page => currentPath.startsWith(page))) {
				isChecking = false;
				return;
			}
			
			// First check if default config exists
			const hasDefault = await HasDefaultConfig();
			
			if (!hasDefault) {
				noDefaultConfig = true;
				showMessage = true;
				isChecking = false;
				return;
			}
			
			// Get default config
			const config = await GetDefaultConfig();
			defaultConfig = config;
			
			// Test the connection
			const testRequest = {
				host: config.host,
				port: config.port,
				ssl_or_https: config.ssl_or_https,
				authentication_method: config.authentication_method,
				username: config.username,
				password: config.password
			};
			
			const response = await CheckConnection(testRequest);
			
			if (!response.success) {
				connectionFailed = true;
				errorMessage = response.error_details || response.message || 'Connection failed';
				showMessage = true;
			} else {
				// Connection successful
				connectionSuccessful = true;
			}
		} catch (error) {
			console.error('Error checking connection:', error);
			connectionFailed = true;
			errorMessage = String(error);
			showMessage = true;
		} finally {
			isChecking = false;
		}
	}
	
	onMount(async () => {
		await checkConnection();
	});
	
	async function handleRetryConnection() {
		isRetrying = true;
		try {
			await checkConnection();
			if (!showMessage) {
				toastStore.show('Connection successful!', { type: 'success', duration: 3000 });
			}
		} finally {
			isRetrying = false;
		}
	}
	
	function handleFixConnection() {
		showEditModal = true;
	}
	
	function handleConnectionSaved() {
		showEditModal = false;
		// Recheck connection after save
		setTimeout(() => {
			handleRetryConnection();
		}, 500);
	}
	
	function handleConnectionCancel() {
		showEditModal = false;
	}
</script>

{#if !isChecking && showMessage}
	<div class="connection-message-container">
		<div class="connection-message-content">
			<!-- Icon -->
			<div class="connection-icon">
				{@html CloseWifi({ theme: 'outline', size: '80', strokeWidth: 2 })}
			</div>
			
			<!-- Title -->
			<h2 class="connection-title">
				{#if noDefaultConfig}
					Default Connection Required
				{:else if connectionFailed}
					Default Connection Failed
				{/if}
			</h2>
			
			<!-- Message -->
			<p class="connection-text">
				{#if noDefaultConfig}
					To use ElasticGaze, you need to configure a default Elasticsearch connection.
				{:else if connectionFailed}
					The default Elasticsearch connection failed to connect.
					<br />
					<span class="error-details">{errorMessage}</span>
				{/if}
			</p>
			
			<!-- Action Buttons -->
			<div class="connection-actions">
				{#if connectionFailed}
					<Button
						variant="primary"
						size="md"
						icon="Refresh"
						loading={isRetrying}
						onclick={handleRetryConnection}
					>
						Retry Connection
					</Button>
					<Button
						variant="accent"
						size="md"
						icon="Pencil"
						onclick={handleFixConnection}
					>
						Fix Connection
					</Button>
				{:else if noDefaultConfig}
					<Button
						variant="accent"
						size="md"
						icon="Connection"
						onclick={() => goto('/connections')}
					>
						Configure Connection
					</Button>
				{/if}
			</div>
		</div>
	</div>
{:else if !isChecking && connectionSuccessful && children}
	{@render children()}
{/if}

<!-- Edit Connection Modal -->
{#if showEditModal && defaultConfig}
	<Modal
		bind:open={showEditModal}
		title="Edit Connection"
		size="xl"
		closable={true}
		centered={true}
	>
		<ConnectionForm
			editMode={true}
			initialData={defaultConfig}
			onSave={handleConnectionSaved}
			onCancel={handleConnectionCancel}
		/>
	</Modal>
{/if}

<style>
	.connection-message-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		padding: 2rem;
	}
	
	.connection-message-content {
		text-align: center;
		max-width: 600px;
	}
	
	.connection-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
		color: var(--color-base-content);
		opacity: 0.3;
	}
	
	.connection-title {
		font-size: 1.875rem;
		font-weight: bold;
		color: var(--color-base-content);
		margin-bottom: 1rem;
	}
	
	.connection-text {
		font-size: 1rem;
		color: var(--color-base-content);
		opacity: 0.7;
		margin-bottom: 2rem;
		line-height: 1.5;
	}
	
	.error-details {
		display: block;
		font-size: 0.875rem;
		color: var(--color-error);
		margin-top: 0.5rem;
	}
	
	.connection-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
