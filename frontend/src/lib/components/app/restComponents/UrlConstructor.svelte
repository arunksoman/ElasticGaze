<script lang="ts">
	import { restStore, activeTab, methodColors, type QueryParam } from './restStore';
	import { GetDefaultConfig } from '$lib/wailsjs/go/main/App';
	import { onMount } from 'svelte';
	import type { models } from '$lib/wailsjs/go/models';
	import { Select } from '$lib/components/ui/formComponents';

	const storeState = $derived($restStore);
	const tab = $derived($activeTab);
	
	let defaultConfig: models.Config | null = $state(null);
	let baseUrl = $state('');
	let userUrl = $state('');
	let fullUrl = $derived.by(() => constructFullUrl());

	const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

	onMount(async () => {
		try {
			const config = await GetDefaultConfig();
			defaultConfig = config;
			updateBaseUrl(config);
		} catch (error) {
			console.error('Failed to load default config:', error);
		}
	});

	$effect(() => {
		if (tab) {
			userUrl = tab.url;
		}
	});

	function updateBaseUrl(config: models.Config) {
		const protocol = config.ssl_or_https ? 'https' : 'http';
		baseUrl = `${protocol}://${config.host}:${config.port}`;
	}

	function constructFullUrl(): string {
		if (!userUrl) return baseUrl;
		
		// If user URL is already complete, use it
		if (userUrl.startsWith('http://') || userUrl.startsWith('https://')) {
			return userUrl;
		}
		
		// Add leading slash if missing
		const path = userUrl.startsWith('/') ? userUrl : `/${userUrl}`;
		
		// Construct with query params if any
		if (tab && tab.queryParams.length > 0) {
			const enabledParams = tab.queryParams.filter(p => p.enabled && p.key);
			if (enabledParams.length > 0) {
				const queryString = enabledParams
					.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
					.join('&');
				return `${baseUrl}${path}?${queryString}`;
			}
		}
		
		return `${baseUrl}${path}`;
	}

	function handleUrlChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newUrl = target.value;
		userUrl = newUrl;
		
		if (tab) {
			restStore.updateTab(tab.id, { url: newUrl });
			
			// Parse query params from URL
			try {
				const url = new URL(newUrl.startsWith('http') ? newUrl : `http://dummy${newUrl}`);
				const params: QueryParam[] = [];
				url.searchParams.forEach((value, key) => {
					params.push({ key, value, enabled: true });
				});
				restStore.updateTabQueryParams(tab.id, params);
			} catch {
				// Invalid URL, ignore
			}
		}
	}

	function handleMethodChange(method: string) {
		if (tab) {
			restStore.updateTab(tab.id, { method });
		}
	}
</script>

<div class="url-constructor space-y-3">
	<!-- Method and URL Input -->
	<div class="flex gap-2">
		<!-- Method Selector -->
		<div class="shrink-0" style="width: 120px;">
			<select
				value={tab?.method || 'GET'}
				onchange={(e) => handleMethodChange((e.target as HTMLSelectElement).value)}
				class="w-full px-3 py-2 bg-(--color-base-200) text-(--color-base-content) border border-(--color-base-300) rounded focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm font-semibold method-select"
			>
				{#each httpMethods as method}
					<option value={method} style="color: {methodColors[method]}; font-weight: 600;">{method}</option>
				{/each}
			</select>
		</div>

		<!-- URL Input -->
		<div class="flex-1">
			<input
				type="text"
				value={userUrl}
				oninput={handleUrlChange}
				placeholder="Enter request URL or path (e.g., /_search or /index/_doc/1)"
				class="w-full px-3 py-2 bg-(--color-base-200) text-(--color-base-content) border border-(--color-base-300) rounded focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm font-mono"
			/>
		</div>
	</div>

	<!-- Full URL Display -->
	<div class="px-3 py-2 bg-(--color-base-300) rounded text-sm">
		<div class="text-xs text-(--color-base-content) opacity-60 mb-1">Full URL:</div>
		<div class="font-mono text-(--color-primary) break-all">
			{fullUrl}
		</div>
	</div>

	{#if !defaultConfig}
		<div class="text-xs text-yellow-500 px-3">
			⚠️ No default connection configured. Please configure a connection first.
		</div>
	{/if}
</div>

<style>
	select.method-select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 8px center;
		padding-right: 28px;
	}
	
	option {
		background-color: var(--color-base-200);
		padding: 8px;
	}
</style>
