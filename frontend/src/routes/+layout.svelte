<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import WindowControls from '$lib/components/ui/WindowControls.svelte';
	import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte';
	import { sidebarExpanded } from '$lib/stores/sidebar';

	let { children } = $props();
	let expanded = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<WindowControls />
<div class="flex">
	<Sidebar on:update:expanded={e => sidebarExpanded.set(e.detail)} />
	<div class="flex-1 transition-all duration-300" style="margin-left: {$sidebarExpanded ? '220px' : '56px'}">
		{@render children?.()}
	</div>
</div>
