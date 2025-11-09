<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';
	import SplitterHandle from './SplitterHandle.svelte';

	interface Props {
		id?: string;
		direction?: 'horizontal' | 'vertical';
		gutterSize?: number;
		minSize?: number | number[];
		maxSize?: number | number[];
		initialSizes?: number[];
		storageKey?: string | null;
		children?: Snippet;
		onresize?: (sizes: number[]) => void;
	}

	let {
		id = `splitter-${Math.random().toString(36).substr(2, 9)}`,
		direction = 'horizontal',
		gutterSize = 5,
		minSize = 100,
		maxSize,
		initialSizes = [],
		storageKey = null,
		children,
		onresize
	}: Props = $props();

	// Container reference
	let containerRef: HTMLDivElement | null = $state(null);
	
	// Pane data
	let paneElements: HTMLElement[] = $state([]);
	let paneSizes: number[] = $state([]);
	let paneMinSizes: number[] = $state([]);
	let paneMaxSizes: (number | undefined)[] = $state([]);
	
	// Drag state
	let isDragging = $state(false);
	let dragHandleIndex = $state(-1);
	let dragStartPosition = $state(0);
	let dragStartSizes: number[] = [];

	/**
	 * Initialize panes from DOM children
	 */
	async function initializePanes() {
		if (!containerRef) return;
		await tick();

		const wrapper = containerRef.querySelector('.splitter-wrapper') as HTMLElement;
		if (!wrapper) return;

		const allChildren = Array.from(wrapper.children) as HTMLElement[];
		const paneNodes = allChildren.filter(el => !el.classList.contains('splitter-handle'));
		
		paneElements = paneNodes;

		// Set constraints
		paneMinSizes = paneNodes.map((_, index) => 
			Array.isArray(minSize) ? (minSize[index] ?? 100) : minSize
		);
		paneMaxSizes = paneNodes.map((_, index) => 
			Array.isArray(maxSize) ? maxSize[index] : maxSize
		);

		// Calculate available space
		const containerSize = getContainerSize();
		const numPanes = paneNodes.length;
		const totalGutterSize = (numPanes - 1) * gutterSize;
		const availableSize = containerSize - totalGutterSize;

		// Load sizes from storage or calculate initial
		const savedSizes = storageKey ? loadFromStorage() : null;
		
		if (savedSizes && savedSizes.length === paneNodes.length) {
			// Check if saved sizes fit in current available space
			const savedTotal = savedSizes.reduce((sum, size) => sum + size, 0);
			if (Math.abs(savedTotal - availableSize) < 10) {
				// Sizes match, use them
				paneSizes = savedSizes;
			} else {
				// Sizes don't match, scale them proportionally
				const ratio = availableSize / savedTotal;
				paneSizes = savedSizes.map(size => size * ratio);
			}
		} else {
			if (initialSizes.length === numPanes) {
				const total = initialSizes.reduce((sum, size) => sum + size, 0);
				paneSizes = initialSizes.map(size => (size / total) * availableSize);
			} else {
				const equalSize = availableSize / numPanes;
				paneSizes = paneNodes.map(() => equalSize);
			}
		}

		applyPaneSizes();
		paneElements = [...paneElements];
		
		await tick();
		await reorderElements();
	}

	/**
	 * Reorder DOM elements to interleave panes and handles
	 */
	async function reorderElements() {
		if (!containerRef) return;
		
		const wrapper = containerRef.querySelector('.splitter-wrapper') as HTMLElement;
		if (!wrapper) return;

		const panes = Array.from(wrapper.querySelectorAll('.splitter-pane')) as HTMLElement[];
		const handles = Array.from(wrapper.querySelectorAll('.splitter-handle')) as HTMLElement[];

		const fragment = document.createDocumentFragment();

		for (let i = 0; i < panes.length; i++) {
			fragment.appendChild(panes[i]);
			if (i < handles.length && handles[i]) {
				fragment.appendChild(handles[i]);
			}
		}

		wrapper.innerHTML = '';
		wrapper.appendChild(fragment);

		paneElements = Array.from(wrapper.querySelectorAll('.splitter-pane')) as HTMLElement[];
	}

	function getContainerSize(): number {
		if (!containerRef) return 0;
		const rect = containerRef.getBoundingClientRect();
		return direction === 'horizontal' ? rect.width : rect.height;
	}

	function applyPaneSizes() {
		paneElements.forEach((pane, index) => {
			const size = paneSizes[index];
			if (size === undefined) return;

			if (direction === 'horizontal') {
				pane.style.width = `${size}px`;
				pane.style.flexBasis = `${size}px`;
			} else {
				pane.style.height = `${size}px`;
				pane.style.flexBasis = `${size}px`;
			}
		});
	}

	function handleDragStart(handleIndex: number) {
		return (e: PointerEvent) => {
			isDragging = true;
			dragHandleIndex = handleIndex;
			dragStartPosition = direction === 'horizontal' ? e.clientX : e.clientY;
			dragStartSizes = [...paneSizes];

			const target = e.currentTarget as HTMLElement;
			target.setPointerCapture(e.pointerId);

			document.addEventListener('pointermove', handleDragMove, { passive: false });
			document.addEventListener('pointerup', handleDragEnd);
		};
	}

	function handleDragMove(e: PointerEvent) {
		if (!isDragging) return;
		e.preventDefault();

		const currentPosition = direction === 'horizontal' ? e.clientX : e.clientY;
		const delta = currentPosition - dragStartPosition;

		const leftIndex = dragHandleIndex;
		const rightIndex = dragHandleIndex + 1;

		let newLeftSize = dragStartSizes[leftIndex] + delta;
		let newRightSize = dragStartSizes[rightIndex] - delta;

		// Apply min constraints
		const leftMin = paneMinSizes[leftIndex];
		const rightMin = paneMinSizes[rightIndex];
		
		newLeftSize = Math.max(newLeftSize, leftMin);
		newRightSize = Math.max(newRightSize, rightMin);

		// Apply max constraints
		const leftMax = paneMaxSizes[leftIndex];
		const rightMax = paneMaxSizes[rightIndex];
		
		if (leftMax !== undefined) newLeftSize = Math.min(newLeftSize, leftMax);
		if (rightMax !== undefined) newRightSize = Math.min(newRightSize, rightMax);

		// Maintain total size between the two panes
		const totalSize = dragStartSizes[leftIndex] + dragStartSizes[rightIndex];
		newRightSize = totalSize - newLeftSize;

		// Re-check constraints
		if (newRightSize < rightMin) {
			newRightSize = rightMin;
			newLeftSize = totalSize - newRightSize;
		}
		if (newLeftSize < leftMin) {
			newLeftSize = leftMin;
			newRightSize = totalSize - newLeftSize;
		}

		// Update only the two panes being resized
		const newSizes = [...paneSizes];
		newSizes[leftIndex] = newLeftSize;
		newSizes[rightIndex] = newRightSize;

		paneSizes = newSizes;
		applyPaneSizes();
		onresize?.(paneSizes);
	}

	function handleDragEnd(e: PointerEvent) {
		if (!isDragging) return;

		isDragging = false;
		dragHandleIndex = -1;

		document.removeEventListener('pointermove', handleDragMove);
		document.removeEventListener('pointerup', handleDragEnd);

		if (storageKey) saveToStorage();
	}

	/**
	 * Handle keyboard-based resizing
	 */
	function handleKeyboardMove(handleIndex: number, delta: number) {
		const leftIndex = handleIndex;
		const rightIndex = handleIndex + 1;

		if (leftIndex < 0 || rightIndex >= paneSizes.length) return;

		let newLeftSize = paneSizes[leftIndex] + delta;
		let newRightSize = paneSizes[rightIndex] - delta;

		// Apply min constraints
		const leftMin = paneMinSizes[leftIndex];
		const rightMin = paneMinSizes[rightIndex];
		
		newLeftSize = Math.max(newLeftSize, leftMin);
		newRightSize = Math.max(newRightSize, rightMin);

		// Apply max constraints
		const leftMax = paneMaxSizes[leftIndex];
		const rightMax = paneMaxSizes[rightIndex];
		
		if (leftMax !== undefined) newLeftSize = Math.min(newLeftSize, leftMax);
		if (rightMax !== undefined) newRightSize = Math.min(newRightSize, rightMax);

		// Maintain total size between the two panes
		const totalSize = paneSizes[leftIndex] + paneSizes[rightIndex];
		newRightSize = totalSize - newLeftSize;

		// Re-check constraints
		if (newRightSize < rightMin) {
			newRightSize = rightMin;
			newLeftSize = totalSize - newRightSize;
		}
		if (newLeftSize < leftMin) {
			newLeftSize = leftMin;
			newRightSize = totalSize - newLeftSize;
		}

		// Update only the two panes being resized
		const newSizes = [...paneSizes];
		newSizes[leftIndex] = newLeftSize;
		newSizes[rightIndex] = newRightSize;

		paneSizes = newSizes;
		applyPaneSizes();
		onresize?.(paneSizes);
		
		if (storageKey) saveToStorage();
	}

	/**
	 * Move splitter to give left pane minimum size (Home key)
	 */
	function handleKeyboardHome(handleIndex: number) {
		const leftIndex = handleIndex;
		const rightIndex = handleIndex + 1;

		if (leftIndex < 0 || rightIndex >= paneSizes.length) return;

		const leftMin = paneMinSizes[leftIndex];
		const totalSize = paneSizes[leftIndex] + paneSizes[rightIndex];
		
		const newLeftSize = leftMin;
		const newRightSize = totalSize - newLeftSize;

		// Check if right pane would violate its constraints
		const rightMin = paneMinSizes[rightIndex];
		if (newRightSize < rightMin) return; // Can't collapse that far

		const newSizes = [...paneSizes];
		newSizes[leftIndex] = newLeftSize;
		newSizes[rightIndex] = newRightSize;

		paneSizes = newSizes;
		applyPaneSizes();
		onresize?.(paneSizes);
		
		if (storageKey) saveToStorage();
	}

	/**
	 * Move splitter to give left pane maximum size (End key)
	 */
	function handleKeyboardEnd(handleIndex: number) {
		const leftIndex = handleIndex;
		const rightIndex = handleIndex + 1;

		if (leftIndex < 0 || rightIndex >= paneSizes.length) return;

		const rightMin = paneMinSizes[rightIndex];
		const totalSize = paneSizes[leftIndex] + paneSizes[rightIndex];
		
		const newRightSize = rightMin;
		const newLeftSize = totalSize - newRightSize;

		// Check if left pane would violate its max constraint
		const leftMax = paneMaxSizes[leftIndex];
		if (leftMax !== undefined && newLeftSize > leftMax) {
			const constrainedLeftSize = leftMax;
			const constrainedRightSize = totalSize - constrainedLeftSize;
			
			const newSizes = [...paneSizes];
			newSizes[leftIndex] = constrainedLeftSize;
			newSizes[rightIndex] = constrainedRightSize;
			
			paneSizes = newSizes;
		} else {
			const newSizes = [...paneSizes];
			newSizes[leftIndex] = newLeftSize;
			newSizes[rightIndex] = newRightSize;
			
			paneSizes = newSizes;
		}

		applyPaneSizes();
		onresize?.(paneSizes);
		
		if (storageKey) saveToStorage();
	}

	function saveToStorage() {
		if (typeof window === 'undefined' || !storageKey) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(paneSizes));
		} catch (e) {
			console.warn('Failed to save splitter state:', e);
		}
	}

	function loadFromStorage(): number[] | null {
		if (typeof window === 'undefined' || !storageKey) return null;
		try {
			const saved = localStorage.getItem(storageKey);
			return saved ? JSON.parse(saved) : null;
		} catch (e) {
			console.warn('Failed to load splitter state:', e);
			return null;
		}
	}

	function handleWindowResize() {
		if (!containerRef || paneElements.length === 0) return;

		const newContainerSize = getContainerSize();
		const currentTotalSize = paneSizes.reduce((sum, size) => sum + size, 0);
		const totalGutterSize = (paneElements.length - 1) * gutterSize;
		const availableSize = newContainerSize - totalGutterSize;

		if (currentTotalSize > 0) {
			const ratio = availableSize / currentTotalSize;
			paneSizes = paneSizes.map(size => size * ratio);
			applyPaneSizes();
		}
	}

	onMount(() => {
		initializePanes();
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});

	// Public API
	export function setSizes(sizes: number[]) {
		paneSizes = sizes;
		applyPaneSizes();
	}

	export function getSizes(): number[] {
		return [...paneSizes];
	}
</script>

<div
	bind:this={containerRef}
	class="splitter-container"
	class:horizontal={direction === 'horizontal'}
	class:vertical={direction === 'vertical'}
>
	<div class="splitter-wrapper">
		{#if children}
			{@render children()}
		{/if}
		
		{#if paneElements.length > 1}
			{#each Array(paneElements.length - 1) as _, handleIndex}
				<SplitterHandle
					index={handleIndex}
					{direction}
					size={gutterSize}
					onDragStart={handleDragStart(handleIndex)}
					onKeyboardMove={(delta) => handleKeyboardMove(handleIndex, delta)}
					onKeyboardHome={() => handleKeyboardHome(handleIndex)}
					onKeyboardEnd={() => handleKeyboardEnd(handleIndex)}
				/>
			{/each}
		{/if}
	</div>
</div>

<style>
	.splitter-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		background-color: var(--color-base-200);
	}

	.splitter-wrapper {
		display: flex;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.splitter-container.horizontal .splitter-wrapper {
		flex-direction: row;
	}

	.splitter-container.vertical .splitter-wrapper {
		flex-direction: column;
	}
</style>
