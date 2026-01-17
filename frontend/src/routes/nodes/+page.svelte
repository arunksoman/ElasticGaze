<script lang="ts">
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import DataTableComponent from '$lib/components/ui/dataTableComponent/dataTableComponent.svelte';
	import type { DataTableColumn } from '$lib/components/ui/dataTableComponent';
	import Popover from '$lib/components/ui/popoverComponents/Popover.svelte';
	import { GetDefaultConfig, GetNodes } from '$lib/wailsjs/go/main/App';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface NodeInfo {
		id: string;
		name: string;
		ip: string;
		master: boolean;
		roles: string[];
		role_string: string;
		attributes: string;
		load: string;
		cpu_percent: number;
		ram_percent: number;
		heap_percent: number;
		disk_percent: number;
		shards: number;
		version: string;
	}

	interface NodesResponse {
		success: boolean;
		nodes: NodeInfo[];
		error?: string;
	}

	let loading = $state(true);
	let error = $state<string | null>(null);
	let nodes = $state<NodeInfo[]>([]);
	let hasDefaultConfig = $state(false);

	async function fetchNodes() {
		try {
			loading = true;
			error = null;

			const config = await GetDefaultConfig();
			if (!config || !config.id) {
				hasDefaultConfig = false;
				loading = false;
				return;
			}

			hasDefaultConfig = true;
			const response: NodesResponse = await GetNodes(config.id);

		console.log('Nodes Response:', response);
		
		if (response.success) {
			nodes = response.nodes || [];
			console.log('Nodes data:', nodes);
			if (nodes.length > 0) {
				console.log('First node sample:', nodes[0]);
			}
			} else {
				error = response.error || 'Failed to fetch nodes';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while fetching nodes';
			console.error('Error fetching nodes:', err);
		} finally {
			loading = false;
		}
	}

	function getRoleDescription(letter: string): string {
		const roleMap: Record<string, string> = {
			c: 'Coordinating only',
			d: 'Data',
			f: 'Data frozen',
			h: 'Data hot',
			i: 'Ingest',
			l: 'Machine learning',
			m: 'Master',
			r: 'Remote cluster client',
			s: 'Data snapshot',
			t: 'Transform',
			w: 'Data warm'
		};
		return roleMap[letter] || letter;
	}

	onMount(() => {
		fetchNodes();
	});

	function getRoleColor(role: string): string {
		const roleColors: Record<string, string> = {
			master: 'oklch(73.7% 0.121 32.639)',
			master_eligible: 'oklch(65% 0.241 354.308)',
			data: 'oklch(77% 0.152 181.912)',
			ingest: 'oklch(82% 0.189 84.429)',
			coordinating_only: 'oklch(90% 0.182 98.111)'
		};
		return roleColors[role] || 'oklch(45% 0.24 277.023)';
	}

	function parseRoles(rolesArray: string[]): string[] {
		if (!rolesArray || rolesArray.length === 0) {
			return ['coordinating_only'];
		}
		
		const nodeTypes: string[] = [];
		const roles = [...new Set(rolesArray)];
		
		// Check for master node (has master role and is current master)
		if (roles.includes('master')) {
			nodeTypes.push('master');
		}
		
		// Check for master eligible (has master role but might not be current master)
		// We'll also add master_eligible if it's in the roles
		if (roles.includes('master') && !nodeTypes.includes('master')) {
			nodeTypes.push('master_eligible');
		}
		
		// Check for data node (any data-related role)
		if (roles.some(r => r.startsWith('data'))) {
			nodeTypes.push('data');
		}
		
		// Check for ingest node
		if (roles.includes('ingest')) {
			nodeTypes.push('ingest');
		}
		
		// If no specific roles, it's coordinating only
		if (nodeTypes.length === 0) {
			nodeTypes.push('coordinating_only');
		}
		
		return nodeTypes;
	}

	const columns: DataTableColumn<NodeInfo>[] = [
		{
			id: 'node_type',
			header: 'Node Type',
			width: 80,
			enable_sort: false,
			is_resizable: true,
			cell: (row) => {
				const nodeTypes = parseRoles(row.roles);
				const dots = nodeTypes.map((type) => 
					`<div class="w-3 h-3 rounded-full" style="background-color: ${getRoleColor(type)};" title="${type.replace(/_/g, ' ')}"></div>`
				).join('');
				return `<div class="flex gap-1 items-center">${dots}</div>`;
			}
		},
		{
			id: 'name',
			header: 'Name',
			accessorKey: 'name',
			width: 150,
			enable_filter: true,
			is_resizable: true
		},
		{
			id: 'id',
			header: 'ID',
			accessorKey: 'id',
			width: 150,
			enable_filter: true,
			is_resizable: true
		},
		{
			id: 'version',
			header: 'Version',
			accessorKey: 'version',
			width: 80,
			is_resizable: true
		},
		{
			id: 'ip',
			header: 'IP',
			accessorKey: 'ip',
			width: 100,
			enable_filter: true,
			is_resizable: true
		},
		{
			id: 'master',
			header: 'Master',
			width: 100,
			is_resizable: true,
			cell: (row) => {
				return row.master ? 'Yes' : 'No';
			}
		},
		{
			id: 'roles',
			header: 'Node Roles',
			width: 150,
			is_resizable: true,
			cell: (row) => {
				const roleString = row.role_string || '';
				if (!roleString) return '';
				
				const roleList = roleString.split('').map(letter => 
					`<div style="padding: 2px 0;"><strong>${letter}</strong> - ${getRoleDescription(letter)}</div>`
				).join('');
				
				return `
					<span style="position: relative; display: inline-block; cursor: help; text-decoration: underline dotted; text-decoration-color: var(--color-base-400);" 
						onmouseenter="
							const tooltip = this.querySelector('.role-tooltip');
							const rect = this.getBoundingClientRect();
							tooltip.style.left = (rect.right + 8) + 'px';
							tooltip.style.top = (rect.top + rect.height / 2) + 'px';
							tooltip.style.transform = 'translateY(-50%)';
							tooltip.style.opacity = '1';
							tooltip.style.visibility = 'visible';
						" 
						onmouseleave="
							const tooltip = this.querySelector('.role-tooltip');
							tooltip.style.opacity = '0';
							tooltip.style.visibility = 'hidden';
						">${roleString}
						<span class="role-tooltip" style="
							position: fixed;
							padding: 8px 12px;
							background-color: var(--color-base-200);
							border: 1px solid var(--color-base-300);
							border-radius: var(--radius-field);
							color: var(--color-base-content);
							font-size: 11px;
							line-height: 1.4;
							white-space: nowrap;
							z-index: 999999;
							box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
							opacity: 0;
							visibility: hidden;
							pointer-events: none;
							transition: opacity 0.2s, visibility 0.2s;
						">
							${roleList}
						</span>
					</span>
				`;
			}
		},
		{
			id: 'shards',
			header: 'Shards',
			accessorKey: 'shards',
			width: 100,
			is_resizable: true
		},
		{
			id: 'attributes',
			header: 'Attributes',
			accessorKey: 'attributes',
			width: 200,
			is_resizable: true
		},
		{
			id: 'load',
			header: 'Load',
			accessorKey: 'load',
			width: 150,
			is_resizable: true
		},
		{
			id: 'cpu',
			header: 'CPU Usage',
			width: 120,
			enable_sort: false,
			is_resizable: true,
			cell: (row) => {
				const value = Math.round(row.cpu_percent * 10) / 10;
				const color = value < 60 ? 'oklch(77% 0.152 181.912)' : value < 80 ? 'oklch(90% 0.182 98.111)' : value <= 90 ? 'oklch(75% 0.183 55.934)' : 'oklch(73.7% 0.121 32.639)';
				return `
					<div style="width: 100%; height: 20px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden; position: relative;">
						<div style="width: ${value}%; height: 100%; background-color: ${color}; transition: width 0.3s ease;"></div>
						<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; color: var(--color-base-content); font-weight: 500;">${value}%</span>
					</div>
				`;
			}
		},
		{
			id: 'ram',
			header: 'System RAM',
			width: 120,
			enable_sort: false,
			is_resizable: true,
			cell: (row) => {
				const value = Math.round(row.ram_percent * 10) / 10;
				const color = value < 60 ? 'oklch(77% 0.152 181.912)' : value < 80 ? 'oklch(90% 0.182 98.111)' : value <= 90 ? 'oklch(75% 0.183 55.934)' : 'oklch(73.7% 0.121 32.639)';
				return `
					<div style="width: 100%; height: 20px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden; position: relative;">
						<div style="width: ${value}%; height: 100%; background-color: ${color}; transition: width 0.3s ease;"></div>
						<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; color: var(--color-base-content); font-weight: 500;">${value}%</span>
					</div>
				`;
			}
		},
		{
			id: 'heap',
			header: 'JVM Heap',
			width: 120,
			enable_sort: false,
			is_resizable: true,
			cell: (row) => {
				const value = Math.round(row.heap_percent * 10) / 10;
				const color = value < 60 ? 'oklch(77% 0.152 181.912)' : value < 80 ? 'oklch(90% 0.182 98.111)' : value <= 90 ? 'oklch(75% 0.183 55.934)' : 'oklch(73.7% 0.121 32.639)';
				return `
					<div style="width: 100%; height: 20px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden; position: relative;">
						<div style="width: ${value}%; height: 100%; background-color: ${color}; transition: width 0.3s ease;"></div>
						<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; color: var(--color-base-content); font-weight: 500;">${value}%</span>
					</div>
				`;
			}
		},
		{
			id: 'disk',
			header: 'Disk Usage',
			width: 120,
			enable_sort: false,
			is_resizable: true,
			cell: (row) => {
				const value = Math.round(row.disk_percent * 10) / 10;
				const color = value < 60 ? 'oklch(77% 0.152 181.912)' : value < 80 ? 'oklch(90% 0.182 98.111)' : value <= 90 ? 'oklch(75% 0.183 55.934)' : 'oklch(73.7% 0.121 32.639)';
				return `
					<div style="width: 100%; height: 20px; background-color: var(--color-base-300); border-radius: var(--radius-field); overflow: hidden; position: relative;">
						<div style="width: ${value}%; height: 100%; background-color: ${color}; transition: width 0.3s ease;"></div>
						<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; color: var(--color-base-content); font-weight: 500;">${value}%</span>
					</div>
				`;
			}
		}
	];
</script>

<div class="h-screen w-full flex flex-col overflow-hidden" style="background-color: var(--color-base-100);">
	<div class="shrink-0 px-6 py-4 border-b" style="border-color: var(--color-base-300);">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold" style="color: var(--color-primary);">Nodes</h1>
			{#if !loading && hasDefaultConfig}
				<button
					type="button"
					onclick={fetchNodes}
					class="px-4 py-2 rounded transition-colors"
					style="background-color: var(--color-primary); color: var(--color-primary-content);"
				>
					Refresh
				</button>
			{/if}
		</div>
	</div>

	<div class="flex-1 px-6 py-4 min-h-0 overflow-hidden">
		{#if !hasDefaultConfig && !loading}
			<DefaultConnectionMessage currentPath={$page.url.pathname} />
		{:else if loading}
			<div class="flex items-center justify-center h-64">
				<div class="text-lg" style="color: var(--color-base-content);">Loading nodes...</div>
			</div>
		{:else if error}
			<div
				class="p-4 rounded border"
				style="background-color: var(--color-error); border-color: var(--color-error); color: var(--color-error-content);"
			>
				<h3 class="font-semibold mb-2">Error loading nodes</h3>
				<p>{error}</p>
			</div>
		{:else if nodes.length === 0}
			<div
				class="p-4 rounded border"
				style="background-color: var(--color-base-200); border-color: var(--color-base-300); color: var(--color-base-content);"
			>
				<p>No nodes found in the cluster.</p>
			</div>
		{:else}
			<div class="rounded-lg border" style="border-color: var(--color-base-300);">
				<DataTableComponent
					data={nodes}
					{columns}
					pagination={{
						pageSize: 25,
						showPageSizeSelector: true,
						showPaginationInfo: true,
						pageSizeOptions: [10, 25, 50, 100]
					}}
				/>
			</div>
		{/if}
	</div>
</div>
