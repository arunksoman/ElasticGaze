<script lang="ts">
	import { ColorRadio, Input, Select, Checkbox, Button, PasswordField } from '$lib/components/ui/formComponents';
	import { toastStore } from '$lib/components/ui/toastComponent/toastStore';
	import { TestTube, Clear, Add } from '@icon-park/svg';
	import { CreateConfig, CheckConnection } from '$lib/wailsjs/go/main/App';
	import type { models } from '$lib/wailsjs/go/models';

	interface Props {
		onSave?: () => void;
		onCancel?: () => void;
		editMode?: boolean;
		initialData?: any;
	}

	let {
		onSave,
		onCancel,
		editMode = false,
		initialData = null
	}: Props = $props();

	// Form state
	let envColor = $state('blue');
	let connectionName = $state('');
	let host = $state('');
	let port = $state('9200');
	let useSSL = $state(false);
	let authMethod = $state('no_auth');
	let username = $state('');
	let password = $state('');
	let apiKey = $state('');
	let setAsDefault = $state(false);
	let isTestingConnection = $state(false);

	// Authentication options
	const authOptions = [
		{ label: 'No Authentication', value: 'no_auth' },
		{ label: 'Basic Auth (Username/Password)', value: 'basic_auth' },
		{ label: 'API Key', value: 'api_key' }
	];

	// Initialize form with existing data if in edit mode
	$effect(() => {
		if (editMode && initialData) {
			envColor = initialData.env_indicator_color || 'blue';
			connectionName = initialData.connection_name || '';
			host = initialData.host || '';
			port = initialData.port || '9200';
			useSSL = initialData.ssl_or_https || false;
			authMethod = initialData.authentication_method || 'no_auth';
			username = initialData.username || '';
			password = initialData.password || '';
			setAsDefault = initialData.set_as_default || false;
		}
	});

	async function handleTestConnection() {
		if (!host) {
			toastStore.show('Please enter a host', { type: 'error', duration: 3000 });
			return;
		}

		isTestingConnection = true;

		try {
			const testRequest = {
				host,
				port,
				ssl_or_https: useSSL,
				authentication_method: authMethod,
				username: authMethod === 'basic_auth' ? username : null,
				password: authMethod === 'basic_auth' ? password : authMethod === 'api_key' ? apiKey : null
			};

			const response = await CheckConnection(testRequest);

			if (response.success) {
				toastStore.show('Connection successful!', { type: 'success', duration: 3000 });
			} else {
				toastStore.show(`Connection failed: ${response.message}`, { type: 'error', duration: 5000 });
			}
		} catch (error) {
			toastStore.show(`Connection test failed: ${error}`, { type: 'error', duration: 5000 });
		} finally {
			isTestingConnection = false;
		}
	}

	async function handleSave() {
		// Validation
		if (!connectionName.trim()) {
			toastStore.show('Please enter a connection name', { type: 'error', duration: 3000 });
			return;
		}

		if (!host.trim()) {
			toastStore.show('Please enter a host', { type: 'error', duration: 3000 });
			return;
		}

		if (authMethod === 'basic_auth' && (!username.trim() || !password.trim())) {
			toastStore.show('Please enter username and password', { type: 'error', duration: 3000 });
			return;
		}

		if (authMethod === 'api_key' && !apiKey.trim()) {
			toastStore.show('Please enter an API key', { type: 'error', duration: 3000 });
			return;
		}

		try {
			const configRequest = {
				connection_name: connectionName,
				env_indicator_color: envColor,
				host,
				port,
				ssl_or_https: useSSL,
				authentication_method: authMethod,
				username: authMethod === 'basic_auth' ? username : null,
				password: authMethod === 'basic_auth' ? password : authMethod === 'api_key' ? apiKey : null,
				set_as_default: setAsDefault
			};

			await CreateConfig(configRequest);
			toastStore.show('Connection saved successfully!', { type: 'success', duration: 3000 });
			
			if (onSave) {
				onSave();
			}
		} catch (error) {
			toastStore.show(`Failed to save connection: ${error}`, { type: 'error', duration: 5000 });
		}
	}

	function handleCancel() {
		// Reset form fields
		envColor = 'blue';
		connectionName = '';
		host = '';
		port = '9200';
		useSSL = false;
		authMethod = 'no_auth';
		username = '';
		password = '';
		apiKey = '';
		setAsDefault = false;
	}
</script>

<div class="connection-form">
	<!-- Form Fields -->
	<div class="form-content space-y-4">
		<!-- Environment Color -->
		<div>
			<ColorRadio
				label="Environment Color"
				bind:value={envColor}
			/>
		</div>

		<!-- Connection Name -->
		<div>
			<Input
				label="Connection Name"
				placeholder="Dev ES Cluster"
				bind:value={connectionName}
			/>
		</div>

		<!-- Host and Port -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Input
					label="Host"
					placeholder="localhost or https://example.com"
					bind:value={host}
				/>
			</div>
			<div>
				<Input
					label="Port"
					type="number"
					placeholder="9200"
					bind:value={port}
				/>
			</div>
		</div>

		<!-- Use SSL/HTTPS -->
		<div>
			<Checkbox
				label="Use SSL/HTTPS"
				bind:checked={useSSL}
			/>
		</div>

		<!-- Authentication -->
		<div>
			<Select
				label="Authentication"
				options={authOptions}
				bind:value={authMethod}
			/>
		</div>

		<!-- Authentication Fields -->
		{#if authMethod === 'basic_auth'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Input
						label="Username"
						placeholder="elastic"
						bind:value={username}
					/>
				</div>
				<div>
					<PasswordField
						label="Password"
						placeholder="********"
						bind:value={password}
					/>
				</div>
			</div>
		{:else if authMethod === 'api_key'}
			<div>
				<PasswordField
					label="API Key"
					placeholder="Enter your API key"
					bind:value={apiKey}
				/>
			</div>
		{/if}

		<!-- Set as Default -->
		<div>
			<Checkbox
				label="Set as default connection"
				bind:checked={setAsDefault}
			/>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="form-actions flex justify-between mt-6">
		<div>
			<Button
				variant="secondary"
				loading={isTestingConnection}
				onclick={handleTestConnection}
			>
				{@html TestTube({ theme: 'outline', size: '16', strokeWidth: 3 })}
				Test Connection
			</Button>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				onclick={handleCancel}
			>
				{@html Clear({ theme: 'outline', size: '16', strokeWidth: 3 })}
				Cancel
			</Button>
			<Button
				variant="primary"
				onclick={handleSave}
			>
				{@html Add({ theme: 'outline', size: '16', strokeWidth: 3 })}
				Save Connection
			</Button>
		</div>
	</div>

	<!-- Environment Color Strip at Bottom -->
	<div
		class="env-color-strip"
		style="
			height: 7px;
			background-color: {envColor === 'red' ? '#ef4444' :
				envColor === 'orange' ? '#f97316' :
				envColor === 'yellow' ? '#eab308' :
				envColor === 'green' ? '#22c55e' :
				envColor === 'blue' ? '#3b82f6' :
				envColor === 'purple' ? '#a855f7' :
				envColor === 'pink' ? '#ec4899' : '#3b82f6'};
			margin: 2rem -1rem -1rem -1rem;
		"
	></div>
</div>

<style>
	.connection-form {
		width: 100%;
	}

	.form-content {
		padding: 1rem 0;
	}

	.space-y-4 > * + * {
		margin-top: 1.5rem;
	}

	.grid {
		display: grid;
	}

	.grid-cols-2 {
		grid-template-columns: repeat(2, 1fr);
	}

	.gap-4 {
		gap: 1rem;
	}

	.flex {
		display: flex;
	}

	.justify-between {
		justify-content: space-between;
	}

	.gap-2 {
		gap: 0.75rem;
	}

	.mt-6 {
		margin-top: 2.5rem;
		padding-bottom: 0.5rem;
	}
</style>
