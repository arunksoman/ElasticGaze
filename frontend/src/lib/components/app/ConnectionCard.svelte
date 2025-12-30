<script lang="ts">
	import Card from '$lib/components/ui/Card/Card.svelte';
	import { Modal } from '$lib/components/ui/modalComponents';
	import { Button } from '$lib/components/ui/formComponents';
	import ConnectionForm from './ConnectionForm.svelte';
	import { MoreOne, Pencil, Delete } from '@icon-park/svg';
	import { DeleteConfig } from '$lib/wailsjs/go/main/App';
	import { toastStore } from '$lib/components/ui/toastComponent/toastStore';
	import { clickOutside } from '$lib/components/ui/popoverComponents/clickOutside';
	
	interface Props {
		connection: any;
		onUpdate?: () => void;
		onDelete?: () => void;
	}
	
	let { connection, onUpdate, onDelete }: Props = $props();
	
	let showMoreMenu = $state(false);
	let showEditModal = $state(false);
	let showDeleteModal = $state(false);
	let isDeleting = $state(false);
	let menuElement = $state<HTMLElement>();
	let buttonElement = $state<HTMLElement>();
	let menuPosition = $state({ top: 0, left: 0 });
	
	function toggleMenu() {
		showMoreMenu = !showMoreMenu;
		if (showMoreMenu && buttonElement) {
			const rect = buttonElement.getBoundingClientRect();
			menuPosition = {
				top: rect.bottom + 8,
				left: rect.right - 192 // 192px = 12rem (min-width of menu)
			};
		}
	}
	
	function handleClickOutside() {
		if (showMoreMenu) {
			showMoreMenu = false;
		}
	}
	
	function handleEditClick() {
		showMoreMenu = false;
		showEditModal = true;
	}
	
	function handleDeleteClick() {
		showMoreMenu = false;
		showDeleteModal = true;
	}
	
	async function confirmDelete() {
		isDeleting = true;
		try {
			await DeleteConfig(connection.id);
			toastStore.show('Connection deleted successfully', { type: 'success', duration: 3000 });
			showDeleteModal = false;
			onDelete?.();
		} catch (error) {
			toastStore.show(`Failed to delete connection: ${error}`, { type: 'error', duration: 5000 });
		} finally {
			isDeleting = false;
		}
	}
	
	function handleEditSaved() {
		showEditModal = false;
		onUpdate?.();
	}
	
	function handleEditCancel() {
		showEditModal = false;
	}
</script>

<Card class="relative h-full">
	<!-- More Menu Button -->
	<div class="absolute top-4 right-4 z-10">
		<button
			bind:this={buttonElement}
			onclick={toggleMenu}
			class="more-button"
			type="button"
			aria-label="More options"
		>
			{@html MoreOne({ theme: 'outline', size: '20', strokeWidth: 3 })}
		</button>
	</div>
	
	<!-- Card Content -->
	<div class="pr-8">
		<h3 class="text-lg font-semibold text-(--color-base-content) mb-2">
			{connection.connection_name}
		</h3>
		<p class="text-sm text-(--color-base-content) opacity-70">
			{connection.host}:{connection.port}
		</p>
		{#if connection.ssl_or_https}
			<span class="text-xs px-2 py-0.5 rounded mt-2 inline-block bg-(--color-info)/20 text-(--color-info)">
				SSL
			</span>
		{/if}
		{#if connection.set_as_default}
			<span class="text-xs px-2 py-0.5 rounded mt-2 ml-2 inline-block bg-(--color-accent)/20 text-(--color-accent)">
				Default
			</span>
		{/if}
	</div>
	
	<!-- Environment Color Strip -->
	<div
		class="absolute bottom-0 left-0 right-0 h-1 rounded-b"
		style="background-color: {connection.env_indicator_color || '#3b82f6'};"
	></div>
</Card>
<!-- Dropdown Menu (outside Card to avoid clipping) -->
{#if showMoreMenu}
	<div 
		class="dropdown-menu-wrapper" 
		bind:this={menuElement}
		use:clickOutside={{ callback: handleClickOutside }}
		style="position: fixed; top: {menuPosition.top}px; left: {menuPosition.left}px; z-index: 1000;"
	>
		<div class="dropdown-menu">
			<!-- Arrow pointing up to the trigger button -->
			<div class="menu-arrow"></div>
			
			<button
				onclick={handleEditClick}
				class="menu-item"
				type="button"
			>
				<span class="icon">{@html Pencil({ theme: 'outline', size: '16', strokeWidth: 3 })}</span>
				<span>Edit</span>
			</button>
			<button
				onclick={handleDeleteClick}
				class="menu-item menu-item-danger"
				type="button"
			>
				<span class="icon">{@html Delete({ theme: 'outline', size: '16', strokeWidth: 3 })}</span>
				<span>Delete</span>
			</button>
		</div>
	</div>
{/if}
<!-- Edit Modal -->
<Modal
	bind:open={showEditModal}
	title="Edit Connection"
	size="xl"
	closable={true}
	centered={true}
>
	<ConnectionForm
		editMode={true}
		initialData={connection}
		onSave={handleEditSaved}
		onCancel={handleEditCancel}
	/>
</Modal>

<!-- Delete Confirmation Modal -->
<Modal
	bind:open={showDeleteModal}
	title="Delete Connection"
	size="sm"
	closable={true}
	centered={true}
>
	<div class="py-4">
		<p class="text-(--color-base-content) mb-4">
			Are you sure you want to delete the connection <strong>{connection.connection_name}</strong>?
			This action cannot be undone.
		</p>
		<div class="flex justify-end gap-2">
			<Button
				variant="outline"
				onclick={() => showDeleteModal = false}
				disabled={isDeleting}
			>
				Cancel
			</Button>
			<Button
				variant="primary"
				onclick={confirmDelete}
				loading={isDeleting}
			>
				Delete
			</Button>
		</div>
	</div>
</Modal>

<style>
	.more-button {
		padding: 0.375rem;
		color: var(--color-base-content);
		background-color: transparent;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.more-button:hover {
		background-color: var(--color-base-300);
	}
	
	.dropdown-menu-wrapper {
		min-width: 12rem;
	}
	
	.dropdown-menu {
		position: relative;
		background-color: var(--color-base-100);
		border: 1px solid var(--color-base-300);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 0.5rem 0;
	}
	
	.menu-arrow {
		position: absolute;
		top: -8px;
		right: 16px;
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid var(--color-base-300);
	}
	
	.menu-arrow::after {
		content: '';
		position: absolute;
		top: 1px;
		left: -7px;
		width: 0;
		height: 0;
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-bottom: 7px solid var(--color-base-100);
	}
	
	.menu-item {
		width: 100%;
		text-align: left;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-base-content);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.menu-item:hover {
		background-color: var(--color-base-300);
	}
	
	.menu-item-danger {
		color: var(--color-error);
	}
	
	.menu-item .icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
