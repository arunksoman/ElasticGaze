<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { GetDefaultConfig } from '$lib/wailsjs/go/main/App';
	import { ENV_COLORS, type EnvColorKey } from '$lib/core/constants';
	import { sidebarExpanded } from '$lib/components/ui/sideBarComponents/sidebar';
	
	let envColor = $state<string | null>(null);
	let currentPath = $state('');
	
	// Pages where we don't want to show the strip
	const excludedPages = ['/about', '/connections'];
	
	// Subscribe to page changes
	$effect(() => {
		page.subscribe(p => {
			currentPath = p.url.pathname;
		});
	});
	
	let showStrip = $derived(!excludedPages.some(excluded => currentPath.startsWith(excluded)));
	let leftOffset = $derived($sidebarExpanded ? '220px' : '56px');
	
	async function loadEnvColor() {
		try {
			const config = await GetDefaultConfig();
			if (config?.env_indicator_color) {
				const colorKey = config.env_indicator_color as EnvColorKey;
				envColor = ENV_COLORS[colorKey] || ENV_COLORS.blue;
			}
		} catch (error) {
			// If no default config or error, don't show strip
			envColor = null;
		}
	}
	
	onMount(async () => {
		await loadEnvColor();
	});
</script>

{#if showStrip && envColor}
	<div 
		class="fixed bottom-0 right-0 h-2.5 z-10 transition-all duration-300"
		style="background-color: {envColor}; left: {leftOffset};"
	></div>
{/if}
