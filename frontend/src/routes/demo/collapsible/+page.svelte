<script lang="ts">
	import { CollapsibleComponent } from '$lib/components/ui/collapsibleComponent';
	import Card from '$lib/components/ui/Card/Card.svelte';
	import { Down, Help, Code, Clipboard, CheckOne } from '@icon-park/svg';

	// State for controlled example
	let controlledOpen = $state(false);

	// State for accordion example
	let activeAccordionKey = $state<string | null>(null);

	// State for complex accordion
	let activeFaqKey = $state<string | null>(null);

	// State for uncontrolled examples
	let basicOpen = $state(false);
	let speedFastOpen = $state(false);
	let speedNormalOpen = $state(false);
	let speedSlowOpen = $state(false);
	let keyboardOpen = $state(false);

	// Accordion items
	const accordionItems = [
		{
			key: 'section-1',
			title: 'Introduction',
			content: 'This is the introduction section with important information about getting started.'
		},
		{
			key: 'section-2',
			title: 'Features',
			content:
				'Our platform offers many features including real-time collaboration, version control, and advanced analytics.'
		},
		{
			key: 'section-3',
			title: 'Pricing',
			content: 'We offer flexible pricing plans to suit businesses of all sizes, from startups to enterprises.'
		}
	];

	// FAQ items
	const faqs = [
		{
			key: 'faq-1',
			question: 'What is ElasticGaze?',
			answer:
				'ElasticGaze is a powerful desktop application for managing and visualizing Elasticsearch clusters. It provides an intuitive interface for searching, monitoring, and analyzing your data.'
		},
		{
			key: 'faq-2',
			question: 'How do I connect to my Elasticsearch cluster?',
			answer:
				'Navigate to the Connections page, click "Add Connection", and enter your cluster URL, credentials, and other connection details. You can save multiple connections for easy switching.'
		},
		{
			key: 'faq-3',
			question: 'Is my data secure?',
			answer:
				'Yes! All connection credentials are stored locally on your machine using encrypted storage. We never transmit your credentials to external servers.'
		},
		{
			key: 'faq-4',
			question: 'Can I use this with Elasticsearch Cloud?',
			answer:
				'Absolutely! ElasticGaze works with Elasticsearch Cloud, on-premise installations, and any Elasticsearch-compatible API.'
		}
	];

	// State for horizontal example
	let horizontalOpen = $state(false);

	// Icon rotation for chevrons
	function getChevronRotation(isOpen: boolean): string {
		return isOpen ? 'transform: rotate(180deg); transition: transform 0.3s;' : 'transition: transform 0.3s;';
	}
</script>

<svelte:head>
	<title>Collapsible Component Demo - ElasticGaze</title>
</svelte:head>

<div class="container mx-auto p-8 space-y-12">
	<!-- Header -->
	<header class="mb-8">
		<h1 class="text-4xl font-bold mb-2" style="color: var(--color-primary)">
			Collapsible / Accordion Component
		</h1>
		<p class="text-lg" style="color: var(--color-base-content); opacity: 0.8;">
			A flexible, accessible component for creating collapsible sections and accordions
		</p>
	</header>

	<!-- Example 1: Basic Uncontrolled -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				1. Basic Uncontrolled Collapsible
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				Component manages its own state. Starts closed by default.
			</p>
		</div>

		<Card padding="none" border={true}>
			<CollapsibleComponent onOpenChange={(isOpen) => basicOpen = isOpen}>
				{#snippet trigger()}
					<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div style="color: var(--color-info)">
									{@html Help({ size: 24 })}
								</div>
								<div>
									<h3 class="font-semibold">Click to expand</h3>
									<p class="text-sm opacity-70">This is an uncontrolled collapsible</p>
								</div>
							</div>
							<div style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(basicOpen)}">
								{@html Down({ size: 20 })}
							</div>
						</div>
					</div>
				{/snippet}

				{#snippet children()}
					<div class="px-4 pb-6 pt-4">
						<p style="color: var(--color-base-content)">
							This content is hidden by default and smoothly animates when you click the trigger
							above. The component manages its own open/closed state internally (uncontrolled mode).
						</p>
						<div class="mt-4 p-4 rounded" style="background-color: var(--color-base-200)">
							<code class="text-sm">defaultOpen = false</code>
						</div>
					</div>
				{/snippet}
			</CollapsibleComponent>
		</Card>
	</section>

	<!-- Example 2: Controlled Mode -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				2. Controlled Mode
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				Parent component controls the open state externally.
			</p>
		</div>

		<div class="flex gap-4 mb-4">
			<button
				class="px-4 py-2 rounded transition-colors"
				style="background-color: var(--color-primary); color: var(--color-primary-content);"
				onclick={() => (controlledOpen = !controlledOpen)}
			>
				{controlledOpen ? 'Close' : 'Open'} Content
			</button>
			<div
				class="px-4 py-2 rounded"
				style="background-color: var(--color-base-200); color: var(--color-base-content);"
			>
				State: <strong>{controlledOpen ? 'Open' : 'Closed'}</strong>
			</div>
		</div>

		<Card padding="none" border={true}>
			<CollapsibleComponent
				bind:open={controlledOpen}
				onOpenChange={(state) => console.log('Controlled state changed:', state)}
			>
				{#snippet trigger()}
					<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div style="color: var(--color-accent)">
									{@html Code({ size: 24 })}
								</div>
								<div>
									<h3 class="font-semibold">Controlled by external state</h3>
									<p class="text-sm opacity-70">Click here or use the button above</p>
								</div>
							</div>
							<div
								style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(controlledOpen)}"
							>
								{@html Down({ size: 20 })}
							</div>
						</div>
					</div>
				{/snippet}

				{#snippet children()}
					<div class="px-4 pb-6 pt-4">
						<p style="color: var(--color-base-content)">
							This collapsible is in <strong>controlled mode</strong>. Its state is managed by the
							parent component and can be changed either by clicking the trigger or by using the
							external button above.
						</p>
						<div class="mt-4 p-4 rounded" style="background-color: var(--color-success); opacity: 0.1;">
							<p class="text-sm font-mono">bind:open={'{controlledOpen}'}</p>
						</div>
					</div>
				{/snippet}
			</CollapsibleComponent>
		</Card>
	</section>

	<!-- Example 3: Accordion Behavior -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				3. Accordion (Only One Open)
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				Multiple collapsibles coordinated to behave like an accordion - opening one closes the
				others.
			</p>
		</div>

		<div class="space-y-2">
			{#each accordionItems as item, index}
				<Card padding="none" border={true} accent={activeAccordionKey === item.key ? 'left' : 'none'}>
					<CollapsibleComponent
						open={activeAccordionKey === item.key}
						onOpenChange={(isOpen) => {
							activeAccordionKey = isOpen ? item.key : null;
						}}
					>
						{#snippet trigger()}
							<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
								<div class="flex items-center justify-between">
									<div>
										<h3 class="font-semibold">
											{index + 1}. {item.title}
										</h3>
									</div>
									<div
										style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(activeAccordionKey === item.key)}"
									>
										{@html Down({ size: 20 })}
									</div>
								</div>
							</div>
						{/snippet}

						{#snippet children()}
							<div class="px-4 pb-6 pt-4">
								<p style="color: var(--color-base-content)">
									{item.content}
								</p>
							</div>
						{/snippet}
					</CollapsibleComponent>
				</Card>
			{/each}
		</div>
	</section>

	<!-- Example 4: FAQ Section -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				4. FAQ Section
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				A practical example: Frequently Asked Questions accordion.
			</p>
		</div>

		<div class="space-y-3">
			{#each faqs as faq}
				<Card padding="none" border={true}>
					<CollapsibleComponent
						open={activeFaqKey === faq.key}
						onOpenChange={(isOpen) => {
							activeFaqKey = isOpen ? faq.key : null;
						}}
					>
						{#snippet trigger()}
							<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
								<div class="flex items-center justify-between gap-4">
									<div class="flex items-center gap-3">
										<div style="color: var(--color-info)">
											{@html Help({ size: 20 })}
										</div>
										<span class="font-medium">{faq.question}</span>
									</div>
									<div
										style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(activeFaqKey === faq.key)}"
									>
										{@html Down({ size: 18 })}
									</div>
								</div>
							</div>
						{/snippet}

						{#snippet children()}
							<div class="px-4 pb-6 pt-4">
								<p style="color: var(--color-base-content); opacity: 0.9;">
									{faq.answer}
								</p>
							</div>
						{/snippet}
					</CollapsibleComponent>
				</Card>
			{/each}
		</div>
	</section>

	<!-- Example 5: Animation Speeds -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				5. Animation Speeds
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				Compare different animation durations: fast (150ms), normal (300ms), and slow (500ms).
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<!-- Fast -->
			<Card padding="none" border={true}>
				<CollapsibleComponent animationDuration="fast" onOpenChange={(isOpen) => speedFastOpen = isOpen}>
					{#snippet trigger()}
						<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">⚡ Fast (150ms)</h3>
								<div style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(speedFastOpen)}">
									{@html Down({ size: 16 })}
								</div>
							</div>
						</div>
					{/snippet}
					{#snippet children()}
						<div class="px-4 pb-6 pt-4">
							<p class="text-sm">Quick animation</p>
						</div>
					{/snippet}
				</CollapsibleComponent>
			</Card>

			<!-- Normal -->
			<Card padding="none" border={true}>
				<CollapsibleComponent animationDuration="normal" onOpenChange={(isOpen) => speedNormalOpen = isOpen}>
					{#snippet trigger()}
						<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">⏱️ Normal (300ms)</h3>
								<div style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(speedNormalOpen)}">
									{@html Down({ size: 16 })}
								</div>
							</div>
						</div>
					{/snippet}
					{#snippet children()}
						<div class="px-4 pb-6 pt-4">
							<p class="text-sm">Balanced animation</p>
						</div>
					{/snippet}
				</CollapsibleComponent>
			</Card>

			<!-- Slow -->
			<Card padding="none" border={true}>
				<CollapsibleComponent animationDuration="slow" onOpenChange={(isOpen) => speedSlowOpen = isOpen}>
					{#snippet trigger()}
						<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold">🐌 Slow (500ms)</h3>
								<div style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(speedSlowOpen)}">
									{@html Down({ size: 16 })}
								</div>
							</div>
						</div>
					{/snippet}
					{#snippet children()}
						<div class="px-4 pb-6 pt-4">
							<p class="text-sm">Smooth, slower animation</p>
						</div>
					{/snippet}
				</CollapsibleComponent>
			</Card>
		</div>
	</section>

	<!-- Example 7: Keyboard Accessibility -->
	<section class="space-y-4">
		<div>
			<h2 class="text-2xl font-semibold mb-2" style="color: var(--color-secondary)">
				6. Keyboard Accessibility
			</h2>
			<p class="text-sm mb-4" style="color: var(--color-base-content); opacity: 0.7;">
				Full keyboard support: Use <kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300)">Tab</kbd> to focus,
				<kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300)">Enter</kbd> or
				<kbd class="px-2 py-1 rounded text-sm" style="background-color: var(--color-base-300)">Space</kbd> to toggle.
			</p>
		</div>

		<Card padding="none" border={true}>
			<CollapsibleComponent onOpenChange={(isOpen) => keyboardOpen = isOpen}>
				{#snippet trigger()}
					<div class="p-4 cursor-pointer hover:bg-base-200 transition-colors">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div style="color: var(--color-success)">
									{@html CheckOne({ size: 24 })}
								</div>
								<div>
									<h3 class="font-semibold">Try keyboard navigation</h3>
									<p class="text-sm opacity-70">
										Tab to this card and press Enter or Space
									</p>
								</div>
							</div>
							<div style="color: var(--color-base-content); opacity: 0.5; {getChevronRotation(keyboardOpen)}">
								{@html Down({ size: 20 })}
							</div>
						</div>
					</div>
				{/snippet}

				{#snippet children()}
					<div class="px-4 pb-6 pt-4">
						<h4 class="font-semibold mb-2">✅ Accessibility Features</h4>
						<ul class="space-y-2 text-sm" style="color: var(--color-base-content);">
							<li>• <code>role="button"</code> on trigger</li>
							<li>• <code>aria-expanded</code> reflects state</li>
							<li>• <code>aria-controls</code> links trigger to content</li>
							<li>• <code>aria-hidden</code> on collapsed content</li>
							<li>• Focus visible outline on keyboard focus</li>
							<li>• Enter and Space key support</li>
						</ul>
					</div>
				{/snippet}
			</CollapsibleComponent>
		</Card>
	</section>

	<!-- Footer Note -->
	<footer class="mt-12 pt-8" style="border-top: 1px solid var(--color-base-300);">
		<Card variant="ghost" padding="lg">
			<div class="flex items-start gap-4">
				<div style="color: var(--color-info)">
					{@html Clipboard({ size: 24 })}
				</div>
				<div>
					<h3 class="font-semibold mb-2">Usage Notes</h3>
					<ul class="space-y-1 text-sm" style="color: var(--color-base-content); opacity: 0.8;">
						<li>
							• All examples use <strong>Tailwind CSS</strong> for styling
						</li>
						<li>
							• Component integrates seamlessly with the <strong>Card component</strong>
						</li>
						<li>• Fully accessible and keyboard navigable</li>
						<li>• Supports both controlled and uncontrolled modes</li>
						<li>
							• See <code>README.md</code> for complete API documentation
						</li>
					</ul>
				</div>
			</div>
		</Card>
	</footer>
</div>

<style>
	kbd {
		font-family: monospace;
		font-weight: 600;
	}
</style>
