<script lang="ts">
	import { MarkdownForm } from '$lib/components/ui/markdownEditorComponent';
	import type { MarkdownFormTheme } from '$lib/components/ui/markdownEditorComponent';

	// Demo state
	let content1 = $state(`# Welcome to Markdown Editor

This is a **demo** of the Markdown Editor component.

## Features

- Write in plain text
- Press **Shift+Enter** to preview
- Click **Edit** to return
- Normal **Enter** for new lines

## Try it out!

1. Edit this text
2. Press Shift+Enter
3. See the preview

### Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

Inline code: \`const x = 42;\`

> This is a blockquote

[Visit ElasticGaze](https://example.com)
`);

	let content2 = $state('');
	let content3 = $state('# Third Editor\n\nThis one starts in preview mode!');
	
	let currentTheme = $state<MarkdownFormTheme>('dark');
	let showMultiple = $state(false);
	let customMinHeight = $state('300px');

	// Event tracking for demo
	let events = $state<string[]>([]);
	
	function logEvent(event: string) {
		events = [...events, `${new Date().toLocaleTimeString()}: ${event}`];
		// Keep only last 10 events
		if (events.length > 10) {
			events = events.slice(-10);
		}
	}

	function handleChange1(value: string) {
		logEvent(`Content changed (${value.length} chars)`);
	}

	function clearEvents() {
		events = [];
	}

	function toggleTheme() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		logEvent(`Theme changed to ${currentTheme}`);
	}
</script>

<div class="demo-page" style="background-color: var(--color-base-100); min-height: 100vh;">
	<div class="container mx-auto px-4 py-8 max-w-6xl">
		<!-- Header -->
		<header class="mb-8">
			<h1 class="text-3xl font-bold mb-2" style="color: var(--color-base-content);">
				Markdown Editor Component Demo
			</h1>
			<p class="text-lg opacity-80" style="color: var(--color-base-content);">
				A textarea-based Markdown editor with live preview functionality
			</p>
		</header>

		<!-- Controls -->
		<div 
			class="controls-panel p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center"
			style="background-color: var(--color-base-200); border: 1px solid var(--color-base-300);"
		>
			<button
				type="button"
				onclick={toggleTheme}
				class="px-4 py-2 rounded font-medium transition-colors"
				style="
					background-color: var(--color-primary);
					color: var(--color-primary-content);
				"
			>
				Toggle Theme ({currentTheme})
			</button>

			<button
				type="button"
				onclick={() => showMultiple = !showMultiple}
				class="px-4 py-2 rounded font-medium transition-colors"
				style="
					background-color: var(--color-secondary);
					color: var(--color-secondary-content);
				"
			>
				{showMultiple ? 'Hide' : 'Show'} Multiple Instances
			</button>

			<label class="flex items-center gap-2" style="color: var(--color-base-content);">
				<span>Min Height:</span>
				<select
					bind:value={customMinHeight}
					class="px-3 py-1 rounded border"
					style="
						background-color: var(--color-base-100);
						color: var(--color-base-content);
						border-color: var(--color-base-300);
					"
				>
					<option value="200px">200px</option>
					<option value="300px">300px</option>
					<option value="400px">400px</option>
					<option value="500px">500px</option>
				</select>
			</label>
		</div>

		<!-- Main Demo -->
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
				Primary Editor
			</h2>
			<p class="mb-4 opacity-80" style="color: var(--color-base-content);">
				Try editing the markdown below. Press <kbd class="kbd">Shift+Enter</kbd> to preview, or click the Preview button.
			</p>
			
			<MarkdownForm
				bind:value={content1}
				onChange={handleChange1}
				theme={currentTheme}
				ariaLabel="Primary markdown editor"
				placeholder="Write your markdown here..."
				onPreviewOpen={() => logEvent('Preview opened')}
				onEditOpen={() => logEvent('Edit mode entered')}
				minHeight={customMinHeight}
			/>
		</section>

		<!-- Empty Editor Demo -->
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
				Empty Editor
			</h2>
			<p class="mb-4 opacity-80" style="color: var(--color-base-content);">
				Start from scratch. The preview button is disabled when there's no content.
			</p>
			
			<MarkdownForm
				bind:value={content2}
				theme={currentTheme}
				ariaLabel="Empty markdown editor"
				placeholder="Start typing your markdown..."
			/>
		</section>

		<!-- Multiple Instances Demo -->
		{#if showMultiple}
			<section class="mb-8">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
					Preview Mode Default
				</h2>
				<p class="mb-4 opacity-80" style="color: var(--color-base-content);">
					This editor starts in preview mode. Each instance maintains its own state.
				</p>
				
				<MarkdownForm
					bind:value={content3}
					theme={currentTheme}
					defaultPreview={true}
					ariaLabel="Third markdown editor"
				/>
			</section>

			<section class="mb-8">
				<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
					Side by Side
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 class="text-lg font-medium mb-2" style="color: var(--color-base-content);">
							Editor A
						</h3>
						<MarkdownForm
							value="# Editor A\n\nIndependent content"
							theme={currentTheme}
							ariaLabel="Editor A"
							minHeight="200px"
						/>
					</div>
					<div>
						<h3 class="text-lg font-medium mb-2" style="color: var(--color-base-content);">
							Editor B
						</h3>
						<MarkdownForm
							value="# Editor B\n\nDifferent content"
							theme={currentTheme}
							ariaLabel="Editor B"
							minHeight="200px"
						/>
					</div>
				</div>
			</section>
		{/if}

		<!-- Event Log -->
		<section class="mb-8">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-semibold" style="color: var(--color-base-content);">
					Event Log
				</h2>
				<button
					type="button"
					onclick={clearEvents}
					class="px-3 py-1 text-sm rounded"
					style="
						background-color: var(--color-error);
						color: var(--color-error-content);
					"
				>
					Clear Log
				</button>
			</div>
			<div
				class="p-4 rounded-lg font-mono text-sm"
				style="
					background-color: var(--color-base-200);
					border: 1px solid var(--color-base-300);
					color: var(--color-base-content);
					min-height: 150px;
					max-height: 300px;
					overflow-y: auto;
				"
			>
				{#if events.length === 0}
					<p class="opacity-50">No events yet. Interact with the editors above.</p>
				{:else}
					{#each events as event}
						<div class="mb-1">{event}</div>
					{/each}
				{/if}
			</div>
		</section>

		<!-- Documentation -->
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
				Features & Usage
			</h2>
			<div
				class="p-6 rounded-lg"
				style="background-color: var(--color-base-200); border: 1px solid var(--color-base-300);"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6" style="color: var(--color-base-content);">
					<div>
						<h3 class="text-lg font-semibold mb-3" style="color: var(--color-primary);">
							Keyboard Shortcuts
						</h3>
						<ul class="space-y-2">
							<li class="flex items-start">
								<kbd class="kbd mr-2">Shift + Enter</kbd>
								<span>Switch to preview mode</span>
							</li>
							<li class="flex items-start">
								<kbd class="kbd mr-2">Enter</kbd>
								<span>New line (edit mode)</span>
							</li>
							<li class="flex items-start">
								<kbd class="kbd mr-2">Tab</kbd>
								<span>Navigate between elements</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-semibold mb-3" style="color: var(--color-primary);">
							Supported Markdown
						</h3>
						<ul class="space-y-2">
							<li>✓ Headings (H1-H6)</li>
							<li>✓ Bold and italic text</li>
							<li>✓ Links and images</li>
							<li>✓ Code blocks and inline code</li>
							<li>✓ Lists (ordered & unordered)</li>
							<li>✓ Blockquotes</li>
							<li>✓ Tables</li>
							<li>✓ Horizontal rules</li>
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-semibold mb-3" style="color: var(--color-primary);">
							Accessibility
						</h3>
						<ul class="space-y-2">
							<li>✓ Keyboard navigation</li>
							<li>✓ ARIA labels and live regions</li>
							<li>✓ Focus management</li>
							<li>✓ Semantic HTML in preview</li>
							<li>✓ Screen reader friendly</li>
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-semibold mb-3" style="color: var(--color-primary);">
							Security
						</h3>
						<ul class="space-y-2">
							<li>✓ HTML sanitization</li>
							<li>✓ XSS prevention</li>
							<li>✓ Safe markdown parsing</li>
							<li>✓ Controlled allowed tags</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Code Example -->
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-4" style="color: var(--color-base-content);">
				Usage Example
			</h2>
			<div
				class="p-4 rounded-lg font-mono text-sm overflow-x-auto"
				style="
					background-color: var(--color-base-300);
					color: var(--color-base-content);
				"
			>
				<pre><code>&lt;script lang="ts"&gt;
  import &#123; MarkdownForm &#125; from '$lib/components/ui/markdownEditorComponent';
  
  let content = $state('# Hello World');
&lt;/script&gt;

&lt;MarkdownForm
  bind:value=&#123;content&#125;
  theme="dark"
  placeholder="Write markdown..."
  onChange=&#123;(value) =&gt; console.log(value)&#125;
  onPreviewOpen=&#123;() =&gt; console.log('Preview opened')&#125;
/&gt;</code></pre>
			</div>
		</section>

		<!-- Footer -->
		<footer class="text-center pt-8 border-t opacity-70" style="border-color: var(--color-base-300); color: var(--color-base-content);">
			<p>Part of ElasticGaze UI Components</p>
		</footer>
	</div>
</div>

<style>
	.kbd {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		font-size: 0.75rem;
		font-family: ui-monospace, monospace;
		background-color: var(--color-base-300);
		border: 1px solid var(--color-base-content);
		border-radius: 0.25rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	button:hover {
		filter: brightness(1.1);
	}

	button:active {
		transform: translateY(1px);
	}
</style>
