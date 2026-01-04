<script lang="ts">
	import { DoubleLeft } from '@icon-park/svg';
	import { restStore } from './restStore';
	import { sidebarExpanded } from '$lib/components/ui/sideBarComponents/sidebar';
	import CollectionTree from './CollectionTree.svelte';

	const storeState = $derived($restStore);
	const mainSidebarState = $derived($sidebarExpanded);
	const leftPosition = $derived(mainSidebarState ? '220px' : '56px');
</script>

<div
	class="secondary-sidebar fixed top-7 h-full bg-(--color-base-200) border-r border-(--color-base-300) transition-all duration-300 z-40"
	class:block={storeState.secondarySidebarOpen}
	class:hidden={!storeState.secondarySidebarOpen}
	style="left: {leftPosition}; width: 280px; height: calc(100vh - 1.75rem);"
>
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3 border-b border-(--color-base-300)">
			<h2 class="text-sm font-semibold text-(--color-base-content)">Collections</h2>
			<button
				class="p-1 hover:bg-(--color-base-300) rounded transition-colors"
				onclick={() => restStore.toggleSecondarySidebar()}
				title="Close sidebar"
			>
				{@html DoubleLeft({ theme: 'outline', size: '18' })}
			</button>
		</div>

		<!-- Collection Tree -->
		<div class="flex-1 overflow-y-auto">
			<CollectionTree />
		</div>
	</div>
</div>

<style>
	.secondary-sidebar {
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
	}
</style>
