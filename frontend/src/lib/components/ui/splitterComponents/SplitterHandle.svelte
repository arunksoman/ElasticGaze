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
	const iconRotation = $derived(direction === 'vertical' ? '90deg' : '0deg');

	function handlePointerDown(e: PointerEvent) {
		e.preventDefault();
		onDragStart?.(e);
	}

	const dragIcon = Drag({
		theme: 'outline',
		size: '14',
		fill: 'currentColor',
		strokeWidth: 3
	});
</script>

<div
	class="splitter-handle"
	class:horizontal={direction === 'horizontal'}
	class:vertical={direction === 'vertical'}
	style:cursor={cursor}
	onpointerdown={handlePointerDown}
>
	<div class="handle-grip" style:transform="rotate({iconRotation})">
		{@html dragIcon}
	</div>
</div>

<style>
	.splitter-handle {
		position: relative;
		flex-shrink: 0;
		background-color: transparent;
		transition: background-color 0.15s ease;
		touch-action: none;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.splitter-handle.horizontal {
		width: 5px;
		height: 100%;
		border-left: 1px solid var(--color-base-300);
		border-right: 1px solid var(--color-base-300);
	}

	.splitter-handle.vertical {
		width: 100%;
		height: 5px;
		border-top: 1px solid var(--color-base-300);
		border-bottom: 1px solid var(--color-base-300);
	}

	.handle-grip {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-base-300);
		color: var(--color-base-content);
		opacity: 0.7;
		transition: all 0.15s ease;
		border-radius: 2px;
		padding: 2px;
		width: 12px;
		height: 32px;
	}

	.splitter-handle:hover {
		background-color: var(--color-primary);
	}

	.splitter-handle:hover .handle-grip {
		opacity: 1;
		background-color: var(--color-primary);
		color: var(--color-primary-content);
	}

	.splitter-handle:active .handle-grip {
		opacity: 1;
	}
</style>
