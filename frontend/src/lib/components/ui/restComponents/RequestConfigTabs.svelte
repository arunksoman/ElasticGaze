<script lang="ts">
	import { restStore, activeTab, type QueryParam } from './restStore';
	import { CodeEditor } from '$lib/components/ui/codeEditorComponents';
	import { MarkdownForm } from '$lib/components/ui/markdownEditorComponent';
	import { Plus, Delete } from '@icon-park/svg';

	const tab = $derived($activeTab);
	let activeConfigTab = $state('body');
	let bodyValue = $state('');
	let descriptionValue = $state('');

	// Sync values with tab
	$effect(() => {
		if (tab) {
			bodyValue = tab.body || '';
			descriptionValue = tab.description || '';
		}
	});

	function handleBodyChange(newBody: string) {
		if (tab) {
			bodyValue = newBody;
			restStore.updateTab(tab.id, { body: newBody });
		}
	}

	function handleDescriptionChange(newDescription: string) {
		if (tab) {
			descriptionValue = newDescription;
			restStore.updateTab(tab.id, { description: newDescription });
		}
	}

	function addQueryParam() {
		if (tab) {
			const newParams: QueryParam[] = [
				...tab.queryParams,
				{ key: '', value: '', enabled: true }
			];
			restStore.updateTabQueryParams(tab.id, newParams);
		}
	}

	function updateQueryParam(index: number, updates: Partial<QueryParam>) {
		if (tab) {
			const newParams = [...tab.queryParams];
			newParams[index] = { ...newParams[index], ...updates };
			restStore.updateTabQueryParams(tab.id, newParams);
			
			// Update URL with new params
			updateUrlFromParams(newParams);
		}
	}

	function deleteQueryParam(index: number) {
		if (tab) {
			const newParams = tab.queryParams.filter((_, i) => i !== index);
			restStore.updateTabQueryParams(tab.id, newParams);
			updateUrlFromParams(newParams);
		}
	}

	function updateUrlFromParams(params: QueryParam[]) {
		if (!tab) return;
		
		// Get base path without query params
		const baseUrl = tab.url.split('?')[0];
		
		// Build query string from enabled params
		const enabledParams = params.filter(p => p.enabled && p.key);
		if (enabledParams.length > 0) {
			const queryString = enabledParams
				.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
				.join('&');
			restStore.updateTab(tab.id, { url: `${baseUrl}?${queryString}` });
		} else {
			restStore.updateTab(tab.id, { url: baseUrl });
		}
	}
</script>

{#if tab}
	<div class="request-config-tabs h-full flex flex-col">
		<!-- Custom Tab Headers -->
		<div class="flex border-b border-(--color-base-300) bg-(--color-base-200)">
			<button
				class="px-4 py-2 text-sm font-semibold transition-colors"
				class:text-(--color-primary)={activeConfigTab === 'body'}
				class:border-b-2={activeConfigTab === 'body'}
				class:border-(--color-primary)={activeConfigTab === 'body'}
				class:text-(--color-base-content)={activeConfigTab !== 'body'}
				class:opacity-60={activeConfigTab !== 'body'}
				onclick={() => activeConfigTab = 'body'}
			>
				Body
			</button>
			<button
				class="px-4 py-2 text-sm font-semibold transition-colors"
				class:text-(--color-primary)={activeConfigTab === 'params'}
				class:border-b-2={activeConfigTab === 'params'}
				class:border-(--color-primary)={activeConfigTab === 'params'}
				class:text-(--color-base-content)={activeConfigTab !== 'params'}
				class:opacity-60={activeConfigTab !== 'params'}
				onclick={() => activeConfigTab = 'params'}
			>
				Query Parameters
			</button>
			<button
				class="px-4 py-2 text-sm font-semibold transition-colors"
				class:text-(--color-primary)={activeConfigTab === 'description'}
				class:border-b-2={activeConfigTab === 'description'}
				class:border-(--color-primary)={activeConfigTab === 'description'}
				class:text-(--color-base-content)={activeConfigTab !== 'description'}
				class:opacity-60={activeConfigTab !== 'description'}
				onclick={() => activeConfigTab = 'description'}
			>
				Description
			</button>
		</div>

		<!-- Tab Content -->
		<div class="flex-1 overflow-hidden">
			{#if activeConfigTab === 'body'}
				<div class="h-full p-3">
					<CodeEditor
						bind:value={bodyValue}
						language="json"
						onchange={handleBodyChange}
						placeholder="Enter request body (JSON)"
						minHeight="300px"
					/>
				</div>
			{:else if activeConfigTab === 'params'}
				<div class="p-3 space-y-2">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold text-(--color-base-content)">Query Parameters</h3>
						<button
							class="flex items-center gap-1 px-3 py-1.5 text-xs bg-(--color-primary) text-(--color-primary-content) rounded hover:opacity-90 transition-opacity"
							onclick={addQueryParam}
						>
							{@html Plus({ theme: 'outline', size: '14' })}
							<span>Add Parameter</span>
						</button>
					</div>

					{#if tab.queryParams.length === 0}
						<div class="text-center py-8 text-(--color-base-content) opacity-60 text-sm">
							No query parameters. Click "Add Parameter" to create one.
						</div>
					{:else}
						<div class="space-y-2">
							{#each tab.queryParams as param, index (index)}
								<div class="flex items-center gap-2 p-2 bg-(--color-base-200) rounded">
									<!-- Enabled Checkbox -->
									<input
										type="checkbox"
										checked={param.enabled}
										onchange={(e) => updateQueryParam(index, { enabled: (e.target as HTMLInputElement).checked })}
										class="shrink-0"
									/>

									<!-- Key Input -->
									<input
										type="text"
										value={param.key}
										oninput={(e) => updateQueryParam(index, { key: (e.target as HTMLInputElement).value })}
										placeholder="Key"
										class="flex-1 px-2 py-1 text-sm bg-(--color-base-100) text-(--color-base-content) border border-(--color-base-300) rounded focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
									/>

									<!-- Value Input -->
									<input
										type="text"
										value={param.value}
										oninput={(e) => updateQueryParam(index, { value: (e.target as HTMLInputElement).value })}
										placeholder="Value"
										class="flex-1 px-2 py-1 text-sm bg-(--color-base-100) text-(--color-base-content) border border-(--color-base-300) rounded focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
									/>

									<!-- Delete Button -->
									<button
										class="shrink-0 p-1 text-red-500 hover:bg-(--color-base-300) rounded transition-colors"
										onclick={() => deleteQueryParam(index)}
									>
										{@html Delete({ theme: 'outline', size: '16' })}
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else if activeConfigTab === 'description'}
				<div class="h-full p-3">
					<MarkdownForm
						bind:value={descriptionValue}
						onChange={handleDescriptionChange}
						placeholder="Add a description for this request (supports Markdown)"
						minHeight="100px"
						theme="dark"
					/>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center h-full text-(--color-base-content) opacity-60">
		<p>No request selected</p>
	</div>
{/if}

<style>
	.request-config-tabs {
		min-height: 0;
	}
</style>
