<script lang="ts">
	import CodeEditor from '$lib/components/ui/codeEditorComponents/CodeEditor.svelte';
	import Button from '$lib/components/ui/formComponents/Button.svelte';
	import Switch from '$lib/components/ui/formComponents/Switch.svelte';
	import ThemeSwitcher from '$lib/components/ui/formComponents/ThemeSwitcher.svelte';
	import Card from '$lib/components/ui/Card/Card.svelte';

	// Sample JSON data for editors
	let editor1Value = $state(`{
  "application": "ElasticGaze",
  "version": "1.0.0",
  "features": [
    "Code Editor",
    "Syntax Highlighting",
    "Theme Support",
    "Zoom Controls"
  ],
  "configuration": {
    "theme": "auto",
    "lineNumbers": true,
    "codeFolding": true,
    "autocomplete": true
  },
  "metadata": {
    "author": "ElasticGaze Team",
    "created": "2025-12-14",
    "lastModified": "2025-12-14"
  }
}`);

	let editor2Value = $state(`{
  "database": {
    "host": "localhost",
    "port": 9200,
    "cluster": "elasticsearch-cluster"
  },
  "indices": [
    "logs-2025.12.14",
    "metrics-2025.12.14",
    "traces-2025.12.14"
  ],
  "settings": {
    "numberOfShards": 3,
    "numberOfReplicas": 1,
    "refreshInterval": "1s"
  }
}`);

	// Editor controls
	let editor1ReadOnly = $state(false);
	let editor2ReadOnly = $state(true);
	let showValidation = $state(true);

	// Validation states
	let editor1Valid = $state(true);
	let editor2Valid = $state(true);

	// Event counters
	let editor1ChangeCount = $state(0);
	let editor2ChangeCount = $state(0);

	// Validation function
	function validateJSON(value: string): boolean {
		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}

	// Event handlers
	function handleEditor1Change(value: string) {
		editor1ChangeCount++;
		editor1Valid = validateJSON(value);
	}

	function handleEditor2Change(value: string) {
		editor2ChangeCount++;
		editor2Valid = validateJSON(value);
	}

	// Format JSON
	function formatJSON(value: string): string {
		try {
			return JSON.stringify(JSON.parse(value), null, 2);
		} catch {
			return value;
		}
	}

	// Minify JSON
	function minifyJSON(value: string): string {
		try {
			return JSON.stringify(JSON.parse(value));
		} catch {
			return value;
		}
	}
</script>

<svelte:head>
	<title>Code Editor Demo - ElasticGaze</title>
</svelte:head>

<div class="p-6" style="background-color: var(--color-base-200);">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2" style="color: var(--color-base-content);">
			Code Editor Component
		</h1>
		<p class="text-base opacity-80" style="color: var(--color-base-content);">
			A fully-featured CodeMirror 6 editor with JSON support, independent zoom controls, theme switching, and accessibility features.
		</p>
	</div>

	<!-- Theme Switcher -->
	<div class="mb-6 flex items-center gap-3">
		<span class="text-sm font-medium" style="color: var(--color-base-content);">
			App Theme:
		</span>
		<ThemeSwitcher label="Toggle Dark/Light" />
	</div>

	<!-- Features Overview -->
	<Card class="mb-6">
		<div slot="header">
			<h2 class="text-xl font-semibold" style="color: var(--color-base-content);">
				✨ Features
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style="color: var(--color-base-content);">
			<div>
				<ul class="space-y-2">
					<li>✓ <strong>Per-instance zoom</strong> (Ctrl+/-, Ctrl+0)</li>
					<li>✓ <strong>JSON syntax highlighting</strong></li>
					<li>✓ <strong>Code folding</strong> (click gutter icons)</li>
					<li>✓ <strong>Autocomplete</strong> (Ctrl+Space)</li>
				</ul>
			</div>
			<div>
				<ul class="space-y-2">
					<li>✓ <strong>Theme switching</strong> (auto/light/dark)</li>
					<li>✓ <strong>Read-only mode</strong></li>
					<li>✓ <strong>Line numbers</strong> with active line</li>
					<li>✓ <strong>Keyboard accessible</strong></li>
				</ul>
			</div>
		</div>
	</Card>

	<!-- Editor 1: Editable with Controls -->
	<Card class="mb-6">
		<div slot="header" class="flex items-center justify-between">
			<h2 class="text-xl font-semibold" style="color: var(--color-base-content);">
				Editor 1: Editable (Independent Zoom)
			</h2>
			<div class="flex items-center gap-4">
				<Switch 
					bind:checked={editor1ReadOnly}
					label="Read-only"
				/>
				{#if showValidation}
					<span 
						class="text-sm font-medium px-3 py-1 rounded"
						style="
							background-color: {editor1Valid ? 'var(--color-success)' : 'var(--color-error)'};
							color: {editor1Valid ? 'var(--color-success-content)' : 'var(--color-error-content)'};
						"
					>
						{editor1Valid ? '✓ Valid JSON' : '✗ Invalid JSON'}
					</span>
				{/if}
			</div>
		</div>

		<div class="space-y-4">
			<!-- Editor -->
			<CodeEditor 
				bind:value={editor1Value}
				readOnly={editor1ReadOnly}
				minHeight="350px"
				maxHeight="500px"
				placeholder="Enter JSON here..."
				onchange={handleEditor1Change}
				onfocus={() => console.log('Editor 1 focused')}
				onblur={() => console.log('Editor 1 blurred')}
			/>

			<!-- Controls -->
			<div class="flex flex-wrap gap-3">
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						editor1Value = formatJSON(editor1Value);
					}}
				>
					Format JSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						editor1Value = minifyJSON(editor1Value);
					}}
				>
					Minify JSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						editor1Value = '{\n  \n}';
					}}
				>
					Clear
				</Button>
				<div class="ml-auto text-sm" style="color: var(--color-base-content); opacity: 0.7;">
					Changes: {editor1ChangeCount}
				</div>
			</div>

			<!-- Instructions -->
			<div 
				class="text-xs p-3 rounded"
				style="background-color: var(--color-base-200); color: var(--color-base-content);"
			>
				<strong>Try these:</strong> Click inside editor and use <kbd>Ctrl + +</kbd> to zoom in, 
				<kbd>Ctrl + -</kbd> to zoom out, <kbd>Ctrl + 0</kbd> to reset. 
				Each editor has its own zoom level!
			</div>
		</div>
	</Card>

	<!-- Editor 2: Initially Read-Only -->
	<Card class="mb-6">
		<div slot="header" class="flex items-center justify-between">
			<h2 class="text-xl font-semibold" style="color: var(--color-base-content);">
				Editor 2: Initially Read-Only (Independent Zoom)
			</h2>
			<div class="flex items-center gap-4">
				<Switch 
					bind:checked={editor2ReadOnly}
					label="Read-only"
				/>
				{#if showValidation}
					<span 
						class="text-sm font-medium px-3 py-1 rounded"
						style="
							background-color: {editor2Valid ? 'var(--color-success)' : 'var(--color-error)'};
							color: {editor2Valid ? 'var(--color-success-content)' : 'var(--color-error-content)'};
						"
					>
						{editor2Valid ? '✓ Valid JSON' : '✗ Invalid JSON'}
					</span>
				{/if}
			</div>
		</div>

		<div class="space-y-4">
			<!-- Editor -->
			<CodeEditor 
				bind:value={editor2Value}
				readOnly={editor2ReadOnly}
				minHeight="300px"
				maxHeight="400px"
				placeholder="Database configuration"
				onchange={handleEditor2Change}
			/>

			<!-- Controls -->
			<div class="flex flex-wrap gap-3">
				<Button
					variant="outline"
					size="sm"
					disabled={editor2ReadOnly}
					onclick={() => {
						editor2Value = formatJSON(editor2Value);
					}}
				>
					Format JSON
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={editor2ReadOnly}
					onclick={() => {
						editor2Value = minifyJSON(editor2Value);
					}}
				>
					Minify JSON
				</Button>
				<div class="ml-auto text-sm" style="color: var(--color-base-content); opacity: 0.7;">
					Changes: {editor2ChangeCount}
				</div>
			</div>

			<!-- Instructions -->
			<div 
				class="text-xs p-3 rounded"
				style="background-color: var(--color-base-200); color: var(--color-base-content);"
			>
				<strong>Note:</strong> This editor starts in read-only mode. Toggle the switch above to enable editing.
				Zoom level is independent from Editor 1!
			</div>
		</div>
	</Card>

	<!-- Keyboard Shortcuts Reference -->
	<Card class="mb-6">
		<div slot="header">
			<h2 class="text-xl font-semibold" style="color: var(--color-base-content);">
				⌨️ Keyboard Shortcuts
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style="color: var(--color-base-content);">
			<div>
				<h3 class="font-semibold mb-2">Zoom Controls</h3>
				<ul class="space-y-1 opacity-80">
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Ctrl + +</kbd> Zoom in</li>
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Ctrl + -</kbd> Zoom out</li>
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Ctrl + 0</kbd> Reset zoom</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold mb-2">Editing</h3>
				<ul class="space-y-1 opacity-80">
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Tab</kbd> Indent</li>
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Shift + Tab</kbd> Outdent</li>
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Ctrl + Space</kbd> Autocomplete</li>
					<li><kbd class="px-2 py-0.5 rounded text-xs" style="background-color: var(--color-base-300);">Ctrl + /</kbd> Toggle fold</li>
				</ul>
			</div>
		</div>
	</Card>

	<!-- Implementation Info -->
	<Card>
		<div slot="header">
			<h2 class="text-xl font-semibold" style="color: var(--color-base-content);">
				📦 Implementation
			</h2>
		</div>
		<div class="space-y-3 text-sm" style="color: var(--color-base-content);">
			<p>
				<strong>Import:</strong>
			</p>
			<pre 
				class="p-3 rounded overflow-x-auto text-xs font-mono"
				style="background-color: var(--color-base-100);"
			>import CodeEditor from '$lib/components/ui/codeEditorComponents/CodeEditor.svelte';</pre>

			<p>
				<strong>Basic Usage:</strong>
			</p>
			<pre 
				class="p-3 rounded overflow-x-auto text-xs font-mono"
				style="background-color: var(--color-base-100);"
			>{@html `&lt;script&gt;\n  let code = $state('{"hello": "world"}');\n&lt;/script&gt;\n\n&lt;CodeEditor bind:value={code} /&gt;`}</pre>

			<p>
				<strong>With Options:</strong>
			</p>
			<pre 
				class="p-3 rounded overflow-x-auto text-xs font-mono"
				style="background-color: var(--color-base-100);"
			>{@html `&lt;CodeEditor \n  bind:value={code}\n  readOnly={false}\n  minHeight="400px"\n  maxHeight="600px"\n  placeholder="Enter JSON..."\n  theme="auto"\n  onchange={(val: string) =&gt; console.log(val)}\n/&gt;`}</pre>

			<p class="pt-2" style="opacity: 0.8;">
				For complete documentation, see <code>README.md</code> in the <code>codeEditorComponents</code> folder.
			</p>
		</div>
	</Card>
</div>

<style>
	kbd {
		display: inline-block;
		font-family: 'Consolas', 'Monaco', monospace;
	}
</style>
