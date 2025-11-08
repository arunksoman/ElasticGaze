<script lang="ts">
	import { Plus } from '@icon-park/svg';
	import { createEventDispatcher } from 'svelte';
	import Tab from './Tab.svelte';
	import type { TabItem } from './tabsStore';

	interface Props {
		tabs: TabItem[];
		activeTabId: string | null;
		maxTabs?: number | null;
		closable?: boolean;
		showAddButton?: boolean;
	}

	let {
		tabs = $bindable([]),
		activeTabId = $bindable(null),
		maxTabs = null,
		closable = true,
		showAddButton = true
	}: Props = $props();

	const dispatch = createEventDispatcher<{
		add: TabItem;
		close: string;
		activate: string;
		editChange: { id: string; edited: boolean };
	}>();

	let tablistRef: HTMLDivElement | null = $state(null);
	let focusedTabIndex = $state(0);

	// Keep focused index in sync with active tab
	$effect(() => {
		if (activeTabId) {
			const index = tabs.findIndex((t) => t.id === activeTabId);
			if (index !== -1) {
				focusedTabIndex = index;
			}
		}
	});

	function handleTabClick(event: CustomEvent<{ id: string }>) {
		const tabId = event.detail.id;
		dispatch('activate', tabId);
	}

	function handleTabClose(event: CustomEvent<{ id: string }>) {
		const tabId = event.detail.id;
		dispatch('close', tabId);
	}

	function handleAddTab() {
		if (maxTabs !== null && tabs.length >= maxTabs) {
			return;
		}

		const newTab: TabItem = {
			id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
			title: `Request ${tabs.length + 1}`,
			edited: false,
			createdAt: Date.now()
		};

		dispatch('add', newTab);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (tabs.length === 0) return;

		switch (e.key) {
			case 'ArrowLeft':
				e.preventDefault();
				focusedTabIndex = Math.max(0, focusedTabIndex - 1);
				focusTab(focusedTabIndex);
				break;

			case 'ArrowRight':
				e.preventDefault();
				focusedTabIndex = Math.min(tabs.length - 1, focusedTabIndex + 1);
				focusTab(focusedTabIndex);
				break;

			case 'Home':
				e.preventDefault();
				focusedTabIndex = 0;
				focusTab(0);
				break;

			case 'End':
				e.preventDefault();
				focusedTabIndex = tabs.length - 1;
				focusTab(tabs.length - 1);
				break;

			case 'Delete':
				if (closable && tabs[focusedTabIndex]) {
					e.preventDefault();
					dispatch('close', tabs[focusedTabIndex].id);
				}
				break;

			case 'w':
				if ((e.ctrlKey || e.metaKey) && closable && tabs[focusedTabIndex]) {
					e.preventDefault();
					dispatch('close', tabs[focusedTabIndex].id);
				}
				break;
		}
	}

	function focusTab(index: number) {
		const tabElement = tablistRef?.children[index] as HTMLElement;
		if (tabElement) {
			tabElement.focus();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="tabs-container" role="group" aria-label="Tabs container" tabindex="-1" onkeydown={handleKeyDown}>
	<div
		bind:this={tablistRef}
		role="tablist"
		aria-label="Request tabs"
		class="tabs-list"
	>
		{#each tabs as tab, index (tab.id)}
			<Tab
				id={tab.id}
				title={tab.title}
				active={tab.id === activeTabId}
				edited={tab.edited}
				{closable}
				on:click={handleTabClick}
				on:close={handleTabClose}
			/>
		{/each}
	</div>

	{#if showAddButton}
		<button
			type="button"
			class="add-tab-btn"
			aria-label="Add new tab"
			title="Add new tab"
			disabled={maxTabs !== null && tabs.length >= maxTabs}
			onclick={handleAddTab}
		>
			{@html Plus({ theme: 'outline', size: '18', strokeWidth: 3 })}
		</button>
	{/if}
</div>

<style>
	.tabs-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-base-100);
		border-bottom: var(--border) solid var(--color-base-300);
		padding: 0.5rem;
	}

	.tabs-list {
		display: flex;
		gap: 0.25rem;
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--color-base-300) transparent;
	}

	.tabs-list::-webkit-scrollbar {
		height: 6px;
	}

	.tabs-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.tabs-list::-webkit-scrollbar-thumb {
		background: var(--color-base-300);
		border-radius: var(--radius-field);
	}

	.tabs-list::-webkit-scrollbar-thumb:hover {
		background: var(--color-base-content);
	}

	.add-tab-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		cursor: pointer;
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.add-tab-btn:hover:not(:disabled) {
		background: var(--color-primary);
		color: var(--color-primary-content);
		border-color: var(--color-primary);
	}

	.add-tab-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.add-tab-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.add-tab-btn :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
