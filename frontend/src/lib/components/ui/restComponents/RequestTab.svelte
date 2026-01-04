<script lang="ts">
	import { restStore, activeTab, methodBgColors, type RestResponse } from './restStore';
	import { ExecuteRestRequest, GetDefaultConfig, UpdateRequest } from '$lib/wailsjs/go/main/App';
	import { models } from '$lib/wailsjs/go/models';
	import { Splitter, SplitterPane, SplitterHandle } from '$lib/components/ui/splitterComponents';
	import UrlConstructor from './UrlConstructor.svelte';
	import RequestConfigTabs from './RequestConfigTabs.svelte';
	import ResponseViewer from './ResponseViewer.svelte';
	import { Button } from '$lib/components/ui/formComponents';
	import { showToast } from '$lib/components/ui/toastComponent';
	import { Send, Close, Save } from '@icon-park/svg';

	const storeState = $derived($restStore);
	const tab = $derived($activeTab);
	
	let isExecuting = $state(false);
	let isSaving = $state(false);

	async function handleSendRequest() {
		if (!tab || isExecuting) return;

		try {
			isExecuting = true;
			
			// Get default config
			const config = await GetDefaultConfig();
			
			// Construct full URL
			const protocol = config.ssl_or_https ? 'https' : 'http';
			const baseUrl = `${protocol}://${config.host}:${config.port}`;
			
			let fullUrl = tab.url;
			if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
				const path = fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
				fullUrl = `${baseUrl}${path}`;
			}
			
			// Create request
			const req = new models.ElasticsearchRestRequest();
			req.method = tab.method;
			req.endpoint = fullUrl;
			if (tab.body) {
				req.body = tab.body;
			}
			
			// Execute request
			const response = await ExecuteRestRequest(config.id, req);
			
			// Store response
			const restResponse: RestResponse = {
				statusCode: response.status_code,
				duration: response.duration || '0ms',
				body: response.response,
				error: response.success ? undefined : response.error_details
			};
			
			restStore.setResponse(tab.id, restResponse);
			
			if (response.success) {
				showToast({
					type: 'success',
					message: 'Request completed successfully'
				});
			} else {
				showToast({
					type: 'error',
					message: 'Request failed',
					description: response.error_details
				});
			}
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to execute request',
				description: error.message
			});
			
			const restResponse: RestResponse = {
				statusCode: 0,
				duration: '0ms',
				body: '',
				error: error.message
			};
			restStore.setResponse(tab.id, restResponse);
		} finally {
			isExecuting = false;
		}
	}

	async function handleSaveRequest() {
		if (!tab || isSaving || !tab.requestId) return;

		try {
			isSaving = true;
			
			const req = new models.UpdateRequestRequest();
			req.name = tab.name;
			req.method = tab.method;
			req.url = tab.url;
			req.body = tab.body || undefined;
			req.description = tab.description || undefined;
			
			await UpdateRequest(tab.requestId, req);
			restStore.markTabClean(tab.id);
			
			showToast({
				type: 'success',
				message: 'Request saved successfully'
			});
		} catch (error: any) {
			showToast({
				type: 'error',
				message: 'Failed to save request',
				description: error.message
			});
		} finally {
			isSaving = false;
		}
	}

	function handleCloseTab(tabId: string) {
		restStore.closeTab(tabId);
	}

	function handleTabNameChange(event: Event) {
		if (!tab) return;
		const input = event.target as HTMLInputElement;
		restStore.updateTab(tab.id, { name: input.value });
	}
</script>

<div class="request-tab h-full flex flex-col">
	<!-- Tab Bar -->
	<div class="flex items-center gap-1 px-3 py-2 bg-(--color-base-200) border-b border-(--color-base-300) overflow-x-auto" role="tablist">
		{#each storeState.activeTabs as t (t.id)}
			<div
				class="flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors"
				class:bg-(--color-base-300)={t.id === storeState.activeTabId}
				class:hover:bg-(--color-base-300)={t.id !== storeState.activeTabId}
				role="tab"
				tabindex="0"
				aria-selected={t.id === storeState.activeTabId}
				onclick={() => restStore.setActiveTab(t.id)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						restStore.setActiveTab(t.id);
					}
				}}
			>
				<span class="text-xs font-semibold {methodBgColors[t.method]} px-1.5 py-0.5 rounded text-white">
					{t.method}
				</span>
				<span class="text-sm text-(--color-base-content) whitespace-nowrap">
					{t.name}
					{#if t.isDirty}
						<span class="text-(--color-primary)">*</span>
					{/if}
				</span>
				<button
					class="p-0.5 hover:bg-(--color-base-200) rounded transition-colors"
					aria-label="Close tab"
					onclick={(e) => {
						e.stopPropagation();
						handleCloseTab(t.id);
					}}
				>
					{@html Close({ theme: 'outline', size: '12' })}
				</button>
			</div>
		{/each}
	</div>

	{#if tab}
		<!-- Request Content -->
		<div class="flex-1 overflow-hidden">
			<Splitter direction="vertical" initialSizes={[60, 40]}>
				<!-- Top: Request Configuration -->
				<SplitterPane id="request-config">
					<div class="h-full flex flex-col p-4 space-y-4 overflow-y-auto">
						<!-- Request Name (Editable) -->
						<div class="flex items-center gap-3">
							<input
								type="text"
								value={tab.name}
								oninput={handleTabNameChange}
								class="flex-1 px-3 py-2 text-lg font-semibold bg-(--color-base-200) text-(--color-base-content) border border-(--color-base-300) rounded focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
								placeholder="Request name"
							/>
							
							<div class="flex gap-2">
								{#if tab.requestId}
									<button
										class="flex items-center gap-2 px-4 py-2 bg-(--color-accent) text-(--color-accent-content) rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
										onclick={handleSaveRequest}
										disabled={isSaving || !tab.isDirty}
									>
										{@html Save({ theme: 'outline', size: '16' })}
										<span class="text-sm font-semibold">
											{isSaving ? 'Saving...' : 'Save'}
										</span>
									</button>
								{/if}
								
								<button
									class="flex items-center gap-2 px-4 py-2 bg-(--color-primary) text-(--color-primary-content) rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
									onclick={handleSendRequest}
									disabled={isExecuting}
								>
									{@html Send({ theme: 'outline', size: '16' })}
									<span class="text-sm font-semibold">
										{isExecuting ? 'Sending...' : 'Send'}
									</span>
								</button>
							</div>
						</div>

						<!-- URL Constructor -->
						<UrlConstructor />

						<!-- Request Configuration Tabs -->
						<div class="flex-1 min-h-0">
							<RequestConfigTabs />
						</div>
					</div>
				</SplitterPane>

				<SplitterHandle index={0} direction="vertical" size={4} />

				<!-- Bottom: Response Viewer -->
				<SplitterPane id="response-viewer">
					<ResponseViewer />
				</SplitterPane>
			</Splitter>
		</div>
	{:else}
		<div class="flex items-center justify-center h-full">
			<div class="text-center text-(--color-base-content) opacity-60">
				<p class="text-lg font-semibold mb-2">No Request Selected</p>
				<p class="text-sm">Create a new request or select one from the collections tree</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.request-tab {
		background: var(--color-base-100);
	}
</style>
