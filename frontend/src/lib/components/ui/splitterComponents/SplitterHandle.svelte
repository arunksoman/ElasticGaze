<script lang="ts">
	import { Drag } from '@icon-park/svg';

	interface Props {
		index: number;
		direction: 'horizontal' | 'vertical';
		size: number;
		onDragStart?: (e: PointerEvent) => void;
	}

	let {
		index,
		direction,
		size = 8,
		onDragStart
	}: Props = $props();

	const cursor = $derived(direction === 'horizontal' ? 'col-resize' : 'row-resize');

	function handlePointerDown(e: PointerEvent) {
		e.preventDefault();
		onDragStart?.(e);
	}

	const dragIcon = Drag({
		theme: 'outline',
		size: '16',
		fill: 'currentColor',
		strokeWidth: 3
	});
</script>

<div
	class="splitter-handle"
	style:width={direction === 'horizontal' ? `${size}px` : '100%'}
	style:height={direction === 'vertical' ? `${size}px` : '100%'}
	style:cursor={cursor}
	onpointerdown={handlePointerDown}
>
	<div class="handle-icon">
		{@html dragIcon}
	</div>
</div>

<style>
	.splitter-handle {
		position: relative;
		flex-shrink: 0;
		background-color: var(--color-base-300);
		transition: background-color 0.15s ease;
		touch-action: none;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.handle-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-base-content);
		opacity: 0.5;
		transition: opacity 0.15s ease;
	}

	.splitter-handle:hover {
		background-color: var(--color-primary);
	}

	.splitter-handle:hover .handle-icon {
		opacity: 1;
		color: var(--color-primary-content);
	}
</style>
