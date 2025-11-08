<script lang="ts">
	import Tabs from '$lib/components/ui/TabComponents/Tabs.svelte';
	import { tabsStore, type TabItem } from '$lib/components/ui/TabComponents/tabsStore';
	import { Edit } from '@icon-park/svg';

	// Initialize with one default tab
	$effect(() => {
		const state = $tabsStore;
		if (state.tabs.length === 0) {
			tabsStore.addTab({ title: 'Request 1' });
		}
	});

	const state = $derived($tabsStore);

	function handleAddTab(event: CustomEvent<TabItem>) {
		// Tab already added via store in Tabs component event
		// This handler is optional for additional logic
	}

	function handleCloseTab(event: CustomEvent<string>) {
		tabsStore.closeTab(event.detail);
	}

	function handleActivateTab(event: CustomEvent<string>) {
		tabsStore.activateTab(event.detail);
	}

	function toggleEditedForActiveTab() {
		if (state.activeTabId) {
			const tab = state.tabs.find((t) => t.id === state.activeTabId);
			if (tab) {
				tabsStore.setEdited(state.activeTabId, !tab.edited);
			}
		}
	}

	const activeTab = $derived(state.tabs.find((t) => t.id === state.activeTabId));
</script>

<div class="demo-container">
	<div class="demo-header">
		<h1>Tab Component Demo</h1>
		<p class="demo-description">
			A themeable, reusable tab system with add, close, and edited state indicators.
		</p>
	</div>

	<div class="tabs-wrapper">
		<Tabs
			bind:tabs={state.tabs}
			bind:activeTabId={state.activeTabId}
			on:add={(e) => tabsStore.addTab()}
			on:close={handleCloseTab}
			on:activate={handleActivateTab}
		/>
	</div>

	{#if activeTab}
		<div class="content-area">
			<div class="content-header">
				<h2>{activeTab.title}</h2>
				{#if activeTab.edited}
					<span class="edited-badge">Modified</span>
				{/if}
			</div>

			<div class="content-body">
				<p class="content-info">
					<strong>Tab ID:</strong>
					{activeTab.id}
				</p>
				<p class="content-info">
					<strong>Created:</strong>
					{new Date(activeTab.createdAt).toLocaleString()}
				</p>
				<p class="content-info">
					<strong>Status:</strong>
					{activeTab.edited ? 'Modified' : 'Unchanged'}
				</p>
			</div>

			<div class="content-actions">
				<button type="button" class="action-btn" onclick={toggleEditedForActiveTab}>
					<span class="btn-icon">
						{@html Edit({ theme: 'outline', size: '16', strokeWidth: 3 })}
					</span>
					{activeTab.edited ? 'Mark as Unchanged' : 'Mark as Modified'}
				</button>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>No tabs open. Click the + button to add a new tab.</p>
		</div>
	{/if}

	<div class="demo-info">
		<h3>Features Demonstrated</h3>
		<ul>
			<li>✓ Add tabs using the <strong>+</strong> button</li>
			<li>✓ Close tabs using the <strong>×</strong> button on each tab</li>
			<li>✓ Click tabs to activate them</li>
			<li>✓ Toggle edited state with the button below</li>
			<li>✓ Keyboard navigation: Arrow keys, Home, End, Delete, Ctrl+W</li>
			<li>✓ Flat design using theme variables (no custom colors)</li>
		</ul>
	</div>
</div>

<style>
	.demo-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		min-height: 100vh;
		background: var(--color-base-100);
		color: var(--color-base-content);
	}

	.demo-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.demo-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.demo-description {
		font-size: 1rem;
		color: var(--color-base-content);
		opacity: 0.8;
		margin: 0;
	}

	.tabs-wrapper {
		background: var(--color-base-200);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-box);
		overflow: hidden;
	}

	.content-area {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		background: var(--color-base-200);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-box);
	}

	.content-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.content-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
	}

	.edited-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		background: var(--color-warning);
		color: var(--color-warning-content);
		border-radius: var(--radius-field);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.content-body {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.content-info {
		font-size: 0.875rem;
		margin: 0;
	}

	.content-info strong {
		color: var(--color-primary);
	}

	.content-actions {
		display: flex;
		gap: 0.75rem;
		padding-top: 0.75rem;
		border-top: var(--border) solid var(--color-base-300);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: var(--color-primary);
		color: var(--color-primary-content);
		border: none;
		border-radius: var(--radius-field);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover {
		background: var(--color-accent);
		color: var(--color-accent-content);
	}

	.action-btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
	}

	.btn-icon :global(svg) {
		width: 100%;
		height: 100%;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		background: var(--color-base-200);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-box);
		text-align: center;
	}

	.empty-state p {
		font-size: 1rem;
		color: var(--color-base-content);
		opacity: 0.6;
		margin: 0;
	}

	.demo-info {
		padding: 1.5rem;
		background: var(--color-base-200);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-box);
	}

	.demo-info h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
		color: var(--color-primary);
	}

	.demo-info ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding-left: 1.5rem;
	}

	.demo-info li {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.demo-info strong {
		color: var(--color-accent);
	}
</style>
