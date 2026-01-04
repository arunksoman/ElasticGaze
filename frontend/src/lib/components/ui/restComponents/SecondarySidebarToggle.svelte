<script lang="ts">
	import { DoubleRight } from '@icon-park/svg';
	import { restStore } from './restStore';
	import { sidebarExpanded } from '$lib/components/ui/sideBarComponents/sidebar';
	import { page } from '$app/stores';

	const storeState = $derived($restStore);
	const mainSidebarState = $derived($sidebarExpanded);
	const isRestPage = $derived($page.url.pathname === '/rest');
	const leftPosition = $derived(mainSidebarState ? '220px' : '56px');
</script>

{#if isRestPage && !storeState.secondarySidebarOpen}
	<button
		class="fixed z-50 bg-(--color-base-200) border border-(--color-base-300) rounded-r-lg p-2 hover:bg-(--color-base-300) transition-all duration-300 shadow-lg"
		style="left: {leftPosition}; top: calc(50% + 0.875rem);"
		onclick={() => restStore.toggleSecondarySidebar()}
		title="Open collections sidebar"
	>
		{@html DoubleRight({ theme: 'outline', size: '18' })}
	</button>
{/if}
