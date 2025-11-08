<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';

	function showSuccessToast() {
		toastStore.show('File uploaded successfully!', {
			type: 'success',
			duration: 5000
		});
	}

	function showErrorToast() {
		toastStore.show('Upload failed. Please retry.', {
			type: 'error',
			duration: 5000
		});
	}

	function showWarningToast() {
		toastStore.show('Warning: Storage space is running low.', {
			type: 'warning',
			duration: 5000
		});
	}

	function showInfoToast() {
		toastStore.show('New updates are available.', {
			type: 'info',
			duration: 5000
		});
	}

	function showMultipleToasts() {
		toastStore.show('First toast notification', { type: 'success', duration: 7000 });
		setTimeout(() => {
			toastStore.show('Second toast notification', { type: 'info', duration: 7000 });
		}, 500);
		setTimeout(() => {
			toastStore.show('Third toast notification', { type: 'warning', duration: 7000 });
		}, 1000);
	}

	function showPersistentToast() {
		toastStore.show('This toast will not auto-dismiss (duration: 0)', {
			type: 'info',
			duration: 0
		});
	}
</script>

<div class="p-8 max-w-4xl mx-auto">
	<h1 class="text-3xl font-bold mb-6" style="color: var(--color-base-content);">
		Toast Notification System Demo
	</h1>

	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
			Basic Toasts
		</h2>
		<div class="flex flex-wrap gap-3">
			<button
				type="button"
				onclick={showSuccessToast}
				class="px-4 py-2 rounded transition-opacity hover:opacity-80"
				style="background-color: var(--color-success); color: var(--color-success-content);"
			>
				Show Success
			</button>
			<button
				type="button"
				onclick={showErrorToast}
				class="px-4 py-2 rounded transition-opacity hover:opacity-80"
				style="background-color: var(--color-error); color: var(--color-error-content);"
			>
				Show Error
			</button>
			<button
				type="button"
				onclick={showWarningToast}
				class="px-4 py-2 rounded transition-opacity hover:opacity-80"
				style="background-color: var(--color-warning); color: var(--color-warning-content);"
			>
				Show Warning
			</button>
		<button
			type="button"
			onclick={showInfoToast}
			class="px-4 py-2 rounded transition-opacity hover:opacity-80"
			style="background-color: var(--color-info); color: var(--color-info-content);"
		>
			Show Info
		</button>
	</div>
</div>

<div class="mb-8">
	<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
		Advanced Features
	</h2>
	<div class="flex flex-wrap gap-3">
		<button
			type="button"
			onclick={showMultipleToasts}
			class="px-4 py-2 rounded transition-opacity hover:opacity-80"
			style="background-color: var(--color-accent); color: var(--color-accent-content);"
		>
			Show Multiple Toasts
		</button>
		<button
			type="button"
			onclick={showPersistentToast}
			class="px-4 py-2 rounded transition-opacity hover:opacity-80"
			style="background-color: var(--color-neutral); color: var(--color-neutral-content);"
		>
			Show Persistent Toast
		</button>
		<button
			type="button"
			onclick={() => toastStore.clear()}
			class="px-4 py-2 rounded transition-opacity hover:opacity-80"
			style="background-color: var(--color-base-300); color: var(--color-base-content);"
		>
			Clear All Toasts
		</button>
	</div>
</div>	<div class="p-6 rounded" style="background-color: var(--color-base-100);">
		<h2 class="text-xl font-semibold mb-3" style="color: var(--color-base-content);">
			Features
		</h2>
		<ul class="space-y-2" style="color: var(--color-base-content);">
			<li>✓ <strong>Multiple concurrent toasts</strong> with independent timers</li>
			<li>✓ <strong>Accent strip</strong> with theme-aware colors</li>
			<li>✓ <strong>Copy to clipboard</strong> functionality</li>
			<li>✓ <strong>Auto-dismiss</strong> with configurable duration</li>
			<li>✓ <strong>Smooth animations</strong> with Svelte transitions</li>
			<li>✓ <strong>Accessible</strong> with ARIA roles and labels</li>
			<li>✓ <strong>Theme integration</strong> using app.css variables</li>
			<li>✓ <strong>Position support</strong> (top/bottom, left/right/center)</li>
		</ul>
	</div>
</div>
