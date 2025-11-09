<script lang="ts">
	import Splitter from '$lib/components/ui/splitterComponents/Splitter.svelte';
	import SplitterPane from '$lib/components/ui/splitterComponents/SplitterPane.svelte';

	let direction: 'horizontal' | 'vertical' = $state('horizontal');
	let horizontalSplitterRef: any = $state(null);
	let verticalSplitterRef: any = $state(null);
	let currentSizes: number[] = $state([]);

	function handleResize(sizes: number[]) {
		currentSizes = sizes;
	}

	function resetLayout() {
		const ref = direction === 'horizontal' ? horizontalSplitterRef : verticalSplitterRef;
		const key = direction === 'horizontal' ? 'demo-horizontal-splitter' : 'demo-vertical-splitter';
		
		if (typeof window !== 'undefined') {
			localStorage.removeItem(key);
		}
		
		// Get current sizes and calculate proportional reset
		const currentSizes = ref?.getSizes() || [];
		if (currentSizes.length === 3) {
			const total = currentSizes.reduce((sum: number, size: number) => sum + size, 0);
			// Reset to 1:2:1 ratio based on available space
			const weights = [1, 2, 1];
			const weightTotal = weights.reduce((sum, w) => sum + w, 0);
			const newSizes = weights.map(w => (w / weightTotal) * total);
			ref?.setSizes(newSizes);
		}
	}

	function getCurrentSizes() {
		const ref = direction === 'horizontal' ? horizontalSplitterRef : verticalSplitterRef;
		const sizes = ref?.getSizes() || [];
		alert(`Current sizes: ${sizes.map((s: number) => Math.round(s)).join(', ')} px`);
	}
</script>

<svelte:head>
	<title>Splitter Demo - ElasticGaze</title>
</svelte:head>

<div class="demo-container">
	<div class="demo-header">
		<h1>Splitter Component Demo</h1>
		<p>Simple resizable panes. Drag the handles to resize.</p>
	</div>

	<div class="controls">
		<div class="control-group">
			<h3>Direction</h3>
			<div class="button-group">
				<button
					class="control-button"
					class:active={direction === 'horizontal'}
					onclick={() => (direction = 'horizontal')}
				>
					Horizontal
				</button>
				<button
					class="control-button"
					class:active={direction === 'vertical'}
					onclick={() => (direction = 'vertical')}
				>
					Vertical
				</button>
			</div>
		</div>

		<div class="control-group">
			<h3>Controls</h3>
			<div class="button-group">
				<button class="control-button" onclick={resetLayout}>Reset Layout</button>
				<button class="control-button" onclick={getCurrentSizes}>Get Sizes</button>
			</div>
		</div>
	</div>

	<div class="stats">
		<div class="stat-item">
			<span class="stat-label">Current Sizes:</span>
			<span class="stat-value">
				{#if currentSizes.length > 0}
					{currentSizes.map((s) => Math.round(s)).join(', ')} px
				{:else}
					Not resized yet
				{/if}
			</span>
		</div>
	</div>

	{#if direction === 'horizontal'}
		<div class="splitter-demo">
			<Splitter
				bind:this={horizontalSplitterRef}
				direction="horizontal"
				gutterSize={5}
				minSize={[150, 200, 150]}
				initialSizes={[1, 2, 1]}
				storageKey="demo-horizontal-splitter"
				onresize={handleResize}
			>
				<SplitterPane id="pane-a" minSize={150}>
					<div class="pane-content pane-a">
						<h2>Pane A</h2>
						<p>Left pane with minimum size of 150px.</p>
						<p>Drag the handle to the right to resize.</p>
					</div>
				</SplitterPane>

				<SplitterPane id="pane-b" minSize={200}>
					<div class="pane-content pane-b">
						<h2>Pane B</h2>
						<p>Center pane with minimum size of 200px.</p>
						<p>Has larger initial size (weight 2).</p>
					</div>
				</SplitterPane>

				<SplitterPane id="pane-c" minSize={150}>
					<div class="pane-content pane-c">
						<h2>Pane C</h2>
						<p>Right pane with minimum size of 150px.</p>
						<p>Layout is persisted to localStorage.</p>
					</div>
				</SplitterPane>
			</Splitter>
		</div>
	{/if}

	{#if direction === 'vertical'}
		<div class="splitter-demo">
			<Splitter
				bind:this={verticalSplitterRef}
				direction="vertical"
				gutterSize={5}
				minSize={[100, 150, 100]}
				initialSizes={[1, 2, 1]}
				storageKey="demo-vertical-splitter"
				onresize={handleResize}
			>
				<SplitterPane id="pane-a" minSize={100}>
					<div class="pane-content pane-a">
						<h2>Pane A (Top)</h2>
						<p>Top pane with minimum 100px height.</p>
					</div>
				</SplitterPane>

				<SplitterPane id="pane-b" minSize={150}>
					<div class="pane-content pane-b">
						<h2>Pane B (Middle)</h2>
						<p>Middle pane with larger vertical space (weight 2).</p>
					</div>
				</SplitterPane>

				<SplitterPane id="pane-c" minSize={100}>
					<div class="pane-content pane-c">
						<h2>Pane C (Bottom)</h2>
						<p>Bottom pane with minimum 100px height.</p>
					</div>
				</SplitterPane>
			</Splitter>
		</div>
	{/if}
</div>

<style>
	.demo-container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		padding: 1.5rem;
		gap: 1.5rem;
		overflow: hidden;
	}

	.demo-header {
		flex-shrink: 0;
	}

	.demo-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: var(--color-primary);
	}

	.demo-header p {
		margin: 0;
		font-size: 0.95rem;
	}

	.controls {
		flex-shrink: 0;
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		padding: 1rem;
		background-color: var(--color-base-100);
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
	}

	.control-group {
		flex: 1;
		min-width: 200px;
	}

	.control-group h3 {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-accent);
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.control-button {
		padding: 0.5rem 1rem;
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.15s ease;
	}

	.control-button:hover {
		background-color: var(--color-base-300);
		border-color: var(--color-primary);
	}

	.control-button.active {
		background-color: var(--color-primary);
		color: var(--color-primary-content);
		border-color: var(--color-primary);
	}

	.stats {
		flex-shrink: 0;
		display: flex;
		gap: 1.5rem;
		padding: 1rem;
		background-color: var(--color-base-100);
		border-radius: var(--radius-box);
		border: var(--border) solid var(--color-base-300);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-accent);
	}

	.stat-value {
		font-size: 1rem;
		font-weight: 500;
		font-family: monospace;
	}

	.splitter-demo {
		flex: 1;
		min-height: 0;
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-box);
		overflow: hidden;
	}

	.pane-content {
		padding: 1.5rem;
		height: 100%;
		overflow: auto;
	}

	.pane-content h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.pane-content p {
		margin: 0 0 0.75rem 0;
		line-height: 1.6;
	}

	.pane-a {
		background-color: var(--color-base-100);
	}

	.pane-b {
		background-color: var(--color-base-100);
	}

	.pane-c {
		background-color: var(--color-base-100);
	}
</style>
