<script lang="ts">
	import { Popover, type PopoverPlacement } from '$lib/components/ui/popoverComponents';
	
	let basicOpen = $state(false);
	let arrowOpen = $state(false);
	let placementOpen = $state(false);
	let currentPlacement = $state<PopoverPlacement>('bottom');
	let eventsLog = $state<string[]>([]);

	const placements: PopoverPlacement[] = [
		'top', 'top-start', 'top-end',
		'bottom', 'bottom-start', 'bottom-end',
		'left', 'left-start', 'left-end',
		'right', 'right-start', 'right-end'
	];

	function logEvent(event: string) {
		eventsLog = [`${new Date().toLocaleTimeString()}: ${event}`, ...eventsLog.slice(0, 9)];
	}

	function clearLog() {
		eventsLog = [];
	}
</script>

<div class="container mx-auto p-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8" style:color="var(--color-base-content)">
		Popover Component Demo
	</h1>

	<div class="space-y-12">
		<!-- Basic Example -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style:color="var(--color-base-content)">
				Basic Popover
			</h2>
			<div class="flex gap-4 items-center">
				<Popover bind:open={basicOpen}>
					{#snippet trigger()}
						<button 
							class="px-4 py-2 border border-solid rounded"
							style:background-color="var(--color-primary)"
							style:color="var(--color-primary-content)"
							style:border-color="var(--color-base-300)"
							style:border-radius="var(--radius-field)"
						>
							Open Basic Popover
						</button>
					{/snippet}
					
					<div class="p-4 min-w-64">
						<h3 class="font-semibold mb-2" style:color="var(--color-base-content)">
							Basic Popover
						</h3>
						<p class="mb-3" style:color="var(--color-base-content)">
							This is a simple popover with some content.
						</p>
						<div class="flex gap-2">
							<button 
								class="px-3 py-1 text-sm border border-solid rounded"
								style:background-color="var(--color-base-200)"
								style:color="var(--color-base-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							>
								Action
							</button>
							<input 
								type="text" 
								placeholder="Focusable input"
								class="px-3 py-1 text-sm border border-solid rounded flex-1"
								style:background-color="var(--color-base-100)"
								style:color="var(--color-base-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							/>
						</div>
					</div>
				</Popover>

				<span style:color="var(--color-base-content)">
					Status: {basicOpen ? 'Open' : 'Closed'}
				</span>
			</div>
		</section>

		<!-- Arrow Example -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style:color="var(--color-base-content)">
				Popover with Arrow
			</h2>
			<div class="flex gap-4 items-center">
				<Popover bind:open={arrowOpen} arrow={true} placement="top">
					{#snippet trigger()}
						<button 
							class="px-4 py-2 border border-solid rounded"
							style:background-color="var(--color-accent)"
							style:color="var(--color-accent-content)"
							style:border-color="var(--color-base-300)"
							style:border-radius="var(--radius-field)"
						>
							Popover with Arrow
						</button>
					{/snippet}
					
					<div class="p-4">
						<h3 class="font-semibold mb-2" style:color="var(--color-base-content)">
							Arrow Popover
						</h3>
						<p style:color="var(--color-base-content)">
							This popover includes a flat arrow pointing to the trigger.
						</p>
						<div class="mt-3 flex gap-2">
							<a 
								href="#demo"
								class="px-3 py-1 text-sm underline"
								style:color="var(--color-primary)"
							>
								Link
							</a>
							<button 
								class="px-3 py-1 text-sm border border-solid rounded"
								style:background-color="var(--color-success)"
								style:color="var(--color-success-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							>
								Submit
							</button>
						</div>
					</div>
				</Popover>

				<span style:color="var(--color-base-content)">
					Status: {arrowOpen ? 'Open' : 'Closed'}
				</span>
			</div>
		</section>

		<!-- Placement Demo -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style:color="var(--color-base-content)">
				Placement Options
			</h2>
			<div class="flex flex-col gap-4">
				<div class="flex flex-wrap gap-2">
					{#each placements as placement}
						<button 
							class="px-3 py-1 text-sm border border-solid rounded"
							class:font-bold={currentPlacement === placement}
							onclick={() => currentPlacement = placement}
							style:background-color={currentPlacement === placement ? 'var(--color-primary)' : 'var(--color-base-200)'}
							style:color={currentPlacement === placement ? 'var(--color-primary-content)' : 'var(--color-base-content)'}
							style:border-color="var(--color-base-300)"
							style:border-radius="var(--radius-field)"
						>
							{placement}
						</button>
					{/each}
				</div>

				<div class="flex gap-4 items-center justify-center py-8">
					<Popover 
						bind:open={placementOpen} 
						placement={currentPlacement}
						arrow={true}
						offset={10}
					>
						{#snippet trigger()}
							<button 
								class="px-6 py-3 border border-solid rounded"
								style:background-color="var(--color-secondary)"
								style:color="var(--color-secondary-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							>
								Trigger ({currentPlacement})
							</button>
						{/snippet}
						
						<div class="p-4 min-w-48">
							<h3 class="font-semibold mb-2" style:color="var(--color-base-content)">
								Placement: {currentPlacement}
							</h3>
							<p class="text-sm" style:color="var(--color-base-content)">
								This popover is positioned using the <code>{currentPlacement}</code> placement.
							</p>
							<div class="mt-3 space-y-2">
								<input 
									type="text" 
									placeholder="First input"
									class="w-full px-3 py-1 text-sm border border-solid rounded"
									style:background-color="var(--color-base-100)"
									style:color="var(--color-base-content)"
									style:border-color="var(--color-base-300)"
									style:border-radius="var(--radius-field)"
								/>
								<input 
									type="text" 
									placeholder="Second input"
									class="w-full px-3 py-1 text-sm border border-solid rounded"
									style:background-color="var(--color-base-100)"
									style:color="var(--color-base-content)"
									style:border-color="var(--color-base-300)"
									style:border-radius="var(--radius-field)"
								/>
							</div>
						</div>
					</Popover>
				</div>
			</div>
		</section>

		<!-- Events Demo -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style:color="var(--color-base-content)">
				Event Logging
			</h2>
			<div class="flex gap-4">
				<div class="flex-1">
					<Popover
						onopen={() => logEvent('Popover opened')}
						onclose={() => logEvent('Popover closed')}
						ontoggle={() => logEvent('Popover toggled')}
						onkeydown={(e) => logEvent(`Key pressed: ${e.key}`)}
						onclickoutside={() => logEvent('Clicked outside')}
						arrow={true}
					>
						{#snippet trigger()}
							<button 
								class="px-4 py-2 border border-solid rounded"
								style:background-color="var(--color-info)"
								style:color="var(--color-info-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							>
								Event Demo
							</button>
						{/snippet}
						
						<div class="p-4">
							<h3 class="font-semibold mb-2" style:color="var(--color-base-content)">
								Event Testing
							</h3>
							<p class="mb-3 text-sm" style:color="var(--color-base-content)">
								Interact with this popover to see events logged.
							</p>
							<div class="space-y-2">
								<button 
									class="w-full px-3 py-1 text-sm border border-solid rounded text-left"
									onclick={() => logEvent('Button clicked inside popover')}
									style:background-color="var(--color-base-200)"
									style:color="var(--color-base-content)"
									style:border-color="var(--color-base-300)"
									style:border-radius="var(--radius-field)"
								>
									Click me
								</button>
								<select 
									class="w-full px-3 py-1 text-sm border border-solid rounded"
									onchange={() => logEvent('Select changed')}
									style:background-color="var(--color-base-100)"
									style:color="var(--color-base-content)"
									style:border-color="var(--color-base-300)"
									style:border-radius="var(--radius-field)"
								>
									<option value="1">Option 1</option>
									<option value="2">Option 2</option>
									<option value="3">Option 3</option>
								</select>
							</div>
						</div>
					</Popover>
				</div>

				<div class="flex-1">
					<div 
						class="p-4 border border-solid rounded h-64 overflow-y-auto"
						style:background-color="var(--color-base-100)"
						style:border-color="var(--color-base-300)"
						style:border-radius="var(--radius-box)"
					>
						<div class="flex justify-between items-center mb-2">
							<h4 class="font-semibold text-sm" style:color="var(--color-base-content)">
								Event Log
							</h4>
							<button 
								class="px-2 py-1 text-xs border border-solid rounded"
								onclick={clearLog}
								style:background-color="var(--color-base-200)"
								style:color="var(--color-base-content)"
								style:border-color="var(--color-base-300)"
								style:border-radius="var(--radius-field)"
							>
								Clear
							</button>
						</div>
						{#if eventsLog.length === 0}
							<p class="text-sm text-center" style:color="var(--color-base-content)">
								No events logged yet...
							</p>
						{:else}
							<ul class="space-y-1">
								{#each eventsLog as event}
									<li class="text-xs font-mono" style:color="var(--color-base-content)">
										{event}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<!-- Keyboard Instructions -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style:color="var(--color-base-content)">
				Keyboard Navigation
			</h2>
			<div 
				class="p-4 border border-solid rounded"
				style:background-color="var(--color-base-100)"
				style:border-color="var(--color-base-300)"
				style:border-radius="var(--radius-box)"
			>
				<h3 class="font-semibold mb-3" style:color="var(--color-base-content)">
					Keyboard Shortcuts
				</h3>
				<ul class="space-y-2 text-sm" style:color="var(--color-base-content)">
					<li><kbd class="px-2 py-1 bg-base-200 rounded text-xs">Space</kbd> or <kbd class="px-2 py-1 bg-base-200 rounded text-xs">Enter</kbd> - Open/close popover when trigger is focused</li>
					<li><kbd class="px-2 py-1 bg-base-200 rounded text-xs">Escape</kbd> - Close popover and return focus to trigger</li>
					<li><kbd class="px-2 py-1 bg-base-200 rounded text-xs">Tab</kbd> - Navigate forward through focusable elements</li>
					<li><kbd class="px-2 py-1 bg-base-200 rounded text-xs">Shift + Tab</kbd> - Navigate backward through focusable elements</li>
				</ul>
			</div>
		</section>
	</div>
</div>

<style>
	kbd {
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		border: var(--border) solid var(--color-base-300);
		border-radius: var(--radius-field);
	}
	
	code {
		background-color: var(--color-base-200);
		color: var(--color-base-content);
		padding: 0.125rem 0.25rem;
		border-radius: var(--radius-field);
		font-size: 0.875em;
	}
</style>