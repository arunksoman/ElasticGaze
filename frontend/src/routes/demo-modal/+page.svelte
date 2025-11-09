<script lang="ts">
	import Modal from '$lib/components/ui/modalComponents/Modal.svelte';

	let basicModalOpen = $state(false);
	let confirmModalOpen = $state(false);
	let formModalOpen = $state(false);
	let persistentModalOpen = $state(false);
	let fullscreenModalOpen = $state(false);
	let nestedModalOpen = $state(false);
	let nestedModal2Open = $state(false);
	let testModalOpen = $state(false); // For testing size + animation

	let selectedSize: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' = $state('md');
	let selectedAnimation: 'fade' | 'scale' | 'slide' | 'none' = $state('scale');

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	function handleFormSubmit() {
		console.log('Form submitted:', formData);
		formModalOpen = false;
	}

	function handleDelete() {
		console.log('Item deleted');
		confirmModalOpen = false;
	}
</script>

<div class="p-8 space-y-8">
	<header class="border-b border-[color(--color-base-300)] pb-6">
		<h1 class="text-3xl font-bold text-[color(--color-base-content)] mb-2">Modal Component Demo</h1>
		<p class="text-[color(--color-base-content)] opacity-70">
			Accessible, themeable modal dialogs with focus trapping and keyboard support.
		</p>
	</header>

	<!-- Basic Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold text-[color(--color-base-content)]">Basic Modals</h2>
		
		<div class="flex flex-wrap gap-4">
			<button
				class="px-4 py-2 bg-[color(--color-primary)] text-[color(--color-primary-content)] rounded hover:opacity-90 transition-opacity"
				onclick={() => (basicModalOpen = true)}
			>
				Open Basic Modal
			</button>

			<button
				class="px-4 py-2 bg-[color(--color-error)] text-[color(--color-error-content)] rounded hover:opacity-90 transition-opacity"
				onclick={() => (confirmModalOpen = true)}
			>
				Open Confirm Dialog
			</button>

			<button
				class="px-4 py-2 bg-[color(--color-success)] text-[color(--color-success-content)] rounded hover:opacity-90 transition-opacity"
				onclick={() => (formModalOpen = true)}
			>
				Open Form Modal
			</button>
		</div>
	</section>

	<!-- Size Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold text-[color(--color-base-content)]">Modal Sizes</h2>
		
		<div class="flex items-center gap-4 mb-4">
			<label for="size-select" class="text-[color(--color-base-content)]">Select Size:</label>
			<select
				id="size-select"
				bind:value={selectedSize}
				class="px-3 py-2 bg-[color(--color-base-100)] text-[color(--color-base-content)] border border-[color(--color-base-300)] rounded"
			>
				<option value="sm">Small</option>
				<option value="md">Medium</option>
				<option value="lg">Large</option>
				<option value="xl">Extra Large</option>
				<option value="fullscreen">Fullscreen</option>
			</select>
		</div>

		<button
			class="px-4 py-2 bg-[color(--color-secondary)] text-[color(--color-secondary-content)] rounded hover:opacity-90 transition-opacity"
			onclick={() => (testModalOpen = true)}
		>
			Open {selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Modal
		</button>
	</section>

	<!-- Animation Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold text-[color(--color-base-content)]">Animations</h2>
		
		<div class="flex items-center gap-4 mb-4">
			<label for="animation-select" class="text-[color(--color-base-content)]">Select Animation:</label>
			<select
				id="animation-select"
				bind:value={selectedAnimation}
				class="px-3 py-2 bg-[color(--color-base-100)] text-[color(--color-base-content)] border border-[color(--color-base-300)] rounded"
			>
				<option value="fade">Fade</option>
				<option value="scale">Scale</option>
				<option value="slide">Slide</option>
				<option value="none">None</option>
			</select>
		</div>

		<button
			class="px-4 py-2 bg-[color(--color-accent)] text-[color(--color-accent-content)] rounded hover:opacity-90 transition-opacity"
			onclick={() => (testModalOpen = true)}
		>
			Test {selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} Animation
		</button>
	</section>

	<!-- Advanced Features -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold text-[color(--color-base-content)]">Advanced Features</h2>
		
		<div class="flex flex-wrap gap-4">
			<button
				class="px-4 py-2 bg-[color(--color-warning)] text-[color(--color-warning-content)] rounded hover:opacity-90 transition-opacity"
				onclick={() => (persistentModalOpen = true)}
			>
				Persistent Modal
			</button>

			<button
				class="px-4 py-2 bg-[color(--color-info)] text-[color(--color-info-content)] rounded hover:opacity-90 transition-opacity"
				onclick={() => (nestedModalOpen = true)}
			>
				Nested Modals
			</button>
		</div>
	</section>

	<!-- Keyboard Instructions -->
	<section class="p-4 bg-[color(--color-base-200)] border border-[color(--color-base-300)] rounded">
		<h3 class="text-lg font-semibold text-[color(--color-base-content)] mb-2">Keyboard Controls</h3>
		<ul class="space-y-1 text-[color(--color-base-content)] opacity-80">
			<li><kbd class="px-2 py-1 bg-[color(--color-base-300)] rounded text-sm">ESC</kbd> - Close modal (except persistent)</li>
			<li><kbd class="px-2 py-1 bg-[color(--color-base-300)] rounded text-sm">Tab</kbd> - Next focusable element</li>
			<li><kbd class="px-2 py-1 bg-[color(--color-base-300)] rounded text-sm">Shift+Tab</kbd> - Previous focusable element</li>
		</ul>
	</section>
</div>

<!-- Basic Modal -->
<Modal
	bind:open={basicModalOpen}
	title="Basic Modal"
	size={selectedSize}
	animation={selectedAnimation}
	onclose={() => console.log('Basic modal closed')}
	onopen={() => console.log('Basic modal opened')}
>
	<div class="space-y-4">
		<p class="text-[color(--color-base-content)]">
			This is a basic modal dialog with a title and close button. You can close it by:
		</p>
		<ul class="list-disc list-inside text-[color(--color-base-content)] opacity-80">
			<li>Clicking the X button</li>
			<li>Pressing ESC</li>
			<li>Clicking outside the modal</li>
			<li>Clicking the Close button below</li>
		</ul>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-base-200)] text-[color(--color-base-content)] rounded hover:bg-[color(--color-base-300)] transition-colors"
			onclick={() => (basicModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<!-- Confirm Delete Modal -->
<Modal
	bind:open={confirmModalOpen}
	title="Confirm Delete"
	size={selectedSize}
	animation={selectedAnimation}
	role="alertdialog"
>
	{#snippet header()}
		<h2 class="text-lg font-bold text-[color(--color-error)] flex items-center gap-2">
			<span>⚠️</span>
			<span>Confirm Delete</span>
		</h2>
	{/snippet}

	<p class="text-[color(--color-base-content)]">
		Are you sure you want to delete this item? This action cannot be undone.
	</p>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-base-200)] text-[color(--color-base-content)] rounded hover:bg-[color(--color-base-300)] transition-colors"
			onclick={() => (confirmModalOpen = false)}
		>
			Cancel
		</button>
		<button
			class="px-4 py-2 bg-[color(--color-error)] text-[color(--color-error-content)] rounded hover:opacity-90 transition-opacity"
			onclick={handleDelete}
		>
			Delete
		</button>
	{/snippet}
</Modal>

<!-- Form Modal -->
<Modal bind:open={formModalOpen} title="Contact Form" size={selectedSize} animation={selectedAnimation}>
	<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
		<div>
			<label for="name" class="block text-sm font-medium text-[color(--color-base-content)] mb-1">
				Name
			</label>
			<input
				id="name"
				type="text"
				bind:value={formData.name}
				class="w-full px-3 py-2 bg-[color(--color-base-100)] text-[color(--color-base-content)] border border-[color(--color-base-300)] rounded focus:outline-none focus:border-[color(--color-primary)]"
				placeholder="Enter your name"
			/>
		</div>

		<div>
			<label for="email" class="block text-sm font-medium text-[color(--color-base-content)] mb-1">
				Email
			</label>
			<input
				id="email"
				type="email"
				bind:value={formData.email}
				class="w-full px-3 py-2 bg-[color(--color-base-100)] text-[color(--color-base-content)] border border-[color(--color-base-300)] rounded focus:outline-none focus:border-[color(--color-primary)]"
				placeholder="your@email.com"
			/>
		</div>

		<div>
			<label for="message" class="block text-sm font-medium text-[color(--color-base-content)] mb-1">
				Message
			</label>
			<textarea
				id="message"
				bind:value={formData.message}
				rows="4"
				class="w-full px-3 py-2 bg-[color(--color-base-100)] text-[color(--color-base-content)] border border-[color(--color-base-300)] rounded focus:outline-none focus:border-[color(--color-primary)] resize-none"
				placeholder="Enter your message"
			></textarea>
		</div>
	</form>

	{#snippet footer()}
		<button
			type="button"
			class="px-4 py-2 bg-[color(--color-base-200)] text-[color(--color-base-content)] rounded hover:bg-[color(--color-base-300)] transition-colors"
			onclick={() => (formModalOpen = false)}
		>
			Cancel
		</button>
		<button
			type="button"
			class="px-4 py-2 bg-[color(--color-primary)] text-[color(--color-primary-content)] rounded hover:opacity-90 transition-opacity"
			onclick={handleFormSubmit}
		>
			Submit
		</button>
	{/snippet}
</Modal>

<!-- Persistent Modal -->
<Modal bind:open={persistentModalOpen} title="Important Notice" size="md" persistent>
	<div class="space-y-4">
		<p class="text-[color(--color-base-content)]">
			This is a persistent modal. You cannot close it by:
		</p>
		<ul class="list-disc list-inside text-[color(--color-base-content)] opacity-80">
			<li>Pressing ESC</li>
			<li>Clicking outside the modal</li>
		</ul>
		<p class="text-[color(--color-base-content)]">
			You must click the "I Understand" button below.
		</p>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-primary)] text-[color(--color-primary-content)] rounded hover:opacity-90 transition-opacity"
			onclick={() => (persistentModalOpen = false)}
		>
			I Understand
		</button>
	{/snippet}
</Modal>

<!-- Nested Modals -->
<Modal bind:open={nestedModalOpen} title="First Modal" zIndex={50}>
	<p class="text-[color(--color-base-content)] mb-4">
		This is the first modal. Click the button below to open a second modal on top.
	</p>
	
	<button
		class="px-4 py-2 bg-[color(--color-secondary)] text-[color(--color-secondary-content)] rounded hover:opacity-90 transition-opacity"
		onclick={() => (nestedModal2Open = true)}
	>
		Open Second Modal
	</button>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-base-200)] text-[color(--color-base-content)] rounded hover:bg-[color(--color-base-300)] transition-colors"
			onclick={() => (nestedModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<Modal bind:open={nestedModal2Open} title="Second Modal (Nested)" zIndex={60} size="sm">
	<p class="text-[color(--color-base-content)]">
		This modal appears on top of the first one with a higher z-index.
	</p>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-primary)] text-[color(--color-primary-content)] rounded hover:opacity-90 transition-opacity"
			onclick={() => (nestedModal2Open = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<!-- Test Modal (Size + Animation) -->
<Modal 
	bind:open={testModalOpen} 
	title={`${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} Modal - ${selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} Animation`} 
	size={selectedSize}
	animation={selectedAnimation}
>
	<div class="space-y-4">
		<p class="text-[color(--color-base-content)]">
			This modal is using the <strong>{selectedSize}</strong> size with <strong>{selectedAnimation}</strong> animation.
		</p>
		<p class="text-[color(--color-base-content)]">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
		</p>
		{#if selectedSize === 'fullscreen'}
			<div class="p-4 bg-[color(--color-primary)] text-[color(--color-primary-content)] rounded">
				<p class="font-semibold">Fullscreen Mode</p>
				<p class="text-sm opacity-90">This modal takes up the entire viewport.</p>
			</div>
		{/if}
		<div class="p-3 bg-[color(--color-base-200)] rounded">
			<p class="text-sm text-[color(--color-base-content)]">
				💡 Tip: Change the size or animation in the dropdowns above, close this modal, and reopen to see the changes!
			</p>
		</div>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[color(--color-base-200)] text-[color(--color-base-content)] rounded hover:bg-[color(--color-base-300)] transition-colors"
			onclick={() => (testModalOpen = false)}
		>
			Close
		</button>
	{/snippet}
</Modal>

<style>
	kbd {
		font-family: monospace;
	}
</style>
