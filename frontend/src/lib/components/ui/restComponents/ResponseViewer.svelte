<script lang="ts">
	import { activeResponse } from './restStore';
	import { CodeEditor } from '$lib/components/ui/codeEditorComponents';

	const response = $derived($activeResponse);
	let formattedBody = $state('');

	$effect(() => {
		if (response) {
			formattedBody = formatResponseBody(response.body);
		} else {
			formattedBody = '';
		}
	});

	function getStatusColor(statusCode: number): string {
		if (statusCode >= 200 && statusCode < 300) return 'text-green-500';
		if (statusCode >= 300 && statusCode < 400) return 'text-blue-500';
		if (statusCode >= 400 && statusCode < 500) return 'text-yellow-500';
		if (statusCode >= 500) return 'text-red-500';
		return 'text-gray-500';
	}

	function formatResponseBody(body: string): string {
		try {
			const parsed = JSON.parse(body);
			return JSON.stringify(parsed, null, 2);
		} catch {
			return body;
		}
	}
</script>

<div class="response-viewer h-full flex flex-col bg-(--color-base-200)">
	{#if response}
		<!-- Response Header -->
		<div class="flex items-center gap-4 px-4 py-3 border-b border-(--color-base-300)">
			<div class="flex items-center gap-2">
				<span class="text-xs text-(--color-base-content) opacity-60">Status:</span>
				<span class="text-sm font-semibold {getStatusColor(response.statusCode)}">
					{response.statusCode}
				</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="text-xs text-(--color-base-content) opacity-60">Time:</span>
				<span class="text-sm font-semibold text-(--color-base-content)">
					{response.duration}
				</span>
			</div>

			{#if response.error}
				<div class="flex items-center gap-2 text-red-500">
					<span class="text-xs opacity-60">Error:</span>
					<span class="text-sm font-semibold">{response.error}</span>
				</div>
			{/if}
		</div>

		<!-- Response Body -->
		<div class="flex-1 min-h-0 overflow-auto">
			<CodeEditor
				value={formattedBody}
				language="json"
				readOnly={true}
				placeholder="Response will appear here"
			/>
		</div>
	{:else}
		<div class="flex items-center justify-center h-full">
			<div class="text-center text-(--color-base-content) opacity-60">
				<p class="text-sm">No response yet</p>
				<p class="text-xs mt-1">Click "Send" to execute the request</p>
			</div>
		</div>
	{/if}
</div>
