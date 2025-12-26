<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import WindowControls from '$lib/components/ui/windowControlComponet/windowControls.svelte';
	import Sidebar from '$lib/components/app/Sidebar.svelte';
	import ToastProvider from '$lib/components/ui/toastComponent/ToastProvider.svelte';
	import { sidebarExpanded } from '$lib/components/ui/sideBarComponents/sidebar';

	let { children } = $props();
	let expanded = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-(--color-base-200)">
	<WindowControls />
	<div class="flex">
		<Sidebar onExpand={(isExpanded: boolean) => sidebarExpanded.set(isExpanded)} />
		<div class="flex-1 transition-all duration-300" style="margin-left: {$sidebarExpanded ? '220px' : '56px'}">
			{@render children?.()}
		</div>
	</div>
	<ToastProvider position="top-right" />
</div>
