<script lang="ts">
	import Card from '$lib/components/ui/Card/Card.svelte';
	import { Info, Connect, Server, DatabasePoint, CheckOne, Attention, CloseOne } from '@icon-park/svg';
	import { CLUSTER_STATUS_COLORS } from '$lib/core/constants';
	import type { models } from '$lib/wailsjs/go/models';
	
	interface Props {
		dashboardData: models.ProcessedDashboardData;
	}
	
	let { dashboardData }: Props = $props();
	
	function getHealthIcon(status: string) {
		switch (status.toLowerCase()) {
			case 'green':
				return CheckOne({ theme: 'filled', size: '20', strokeWidth: 3 });
			case 'yellow':
				return Attention({ theme: 'filled', size: '20', strokeWidth: 3 });
			case 'red':
				return CloseOne({ theme: 'filled', size: '20', strokeWidth: 3 });
			default:
				return CheckOne({ theme: 'filled', size: '20', strokeWidth: 3 });
		}
	}
	
	function getHealthColor(status: string) {
		const statusKey = status.toLowerCase() as keyof typeof CLUSTER_STATUS_COLORS;
		return CLUSTER_STATUS_COLORS[statusKey] || CLUSTER_STATUS_COLORS.green;
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
	<!-- Cluster Info Card -->
	<Card variant="outlined" padding="md" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2 mb-2">
				<span class="text-(--color-base-content)">
					{@html Info({ theme: 'outline', size: '20', strokeWidth: 3 })}
				</span>
				<h3 class="text-base font-semibold text-(--color-base-content)">Cluster Info</h3>
			</div>
		{/snippet}
		
		<div class="space-y-2">
			<div>
				<p class="text-xs text-(--color-base-content) opacity-60 uppercase tracking-wide">Name</p>
				<p class="text-sm font-medium text-(--color-base-content)">{dashboardData.cluster_info?.cluster_name || 'N/A'}</p>
			</div>
			<div>
				<p class="text-xs text-(--color-base-content) opacity-60 uppercase tracking-wide">Health</p>
				<div class="flex items-center gap-1">
					<span style="color: {getHealthColor(dashboardData.cluster_health?.status || 'green')}">
						{@html getHealthIcon(dashboardData.cluster_health?.status || 'green')}
					</span>
					<span class="text-sm font-medium capitalize" style="color: {getHealthColor(dashboardData.cluster_health?.status || 'green')}">
						{dashboardData.cluster_health?.status || 'Unknown'}
					</span>
				</div>
			</div>
		</div>
	</Card>
	
	<!-- Nodes Card -->
	<Card variant="outlined" padding="md" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2 mb-2">
				<span class="text-(--color-base-content)">
					{@html Connect({ theme: 'outline', size: '20', strokeWidth: 3 })}
				</span>
				<h3 class="text-base font-semibold text-(--color-base-content)">Nodes</h3>
			</div>
		{/snippet}
		
		<div class="space-y-2">
			<div class="flex justify-between items-center">
				<span class="text-xs text-(--color-base-content) opacity-60">Master:</span>
				<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.node_counts?.master || 0}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-xs text-(--color-base-content) opacity-60">Data:</span>
				<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.node_counts?.data || 0}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-xs text-(--color-base-content) opacity-60">Ingest:</span>
				<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.node_counts?.ingest || 0}</span>
			</div>
			<div class="pt-2 border-t border-t-(--color-base-300)">
				<div class="flex justify-between items-center">
					<span class="text-sm font-medium text-(--color-base-content)">Total:</span>
					<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.node_counts?.total || 0}</span>
				</div>
			</div>
		</div>
	</Card>
	
	<!-- Shards Card -->
	<Card variant="outlined" padding="md" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2 mb-2">
				<span class="text-(--color-base-content)">
					{@html Server({ theme: 'outline', size: '20', strokeWidth: 3 })}
				</span>
				<h3 class="text-base font-semibold text-(--color-base-content)">Shards</h3>
			</div>
		{/snippet}
		
		<div class="space-y-2">
			<div class="flex justify-between items-center">
				<span class="text-xs text-(--color-base-content) opacity-60">Primary:</span>
				<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.shard_counts?.primary || 0}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-xs text-(--color-base-content) opacity-60">Replica:</span>
				<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.shard_counts?.replica || 0}</span>
			</div>
			<div class="pt-2 border-t border-t-(--color-base-300)">
				<div class="flex justify-between items-center">
					<span class="text-sm font-medium text-(--color-base-content)">Total:</span>
					<span class="text-2xl font-bold text-(--color-base-content)">{dashboardData.shard_counts?.total || 0}</span>
				</div>
			</div>
		</div>
	</Card>
	
	<!-- Indices Card -->
	<Card variant="outlined" padding="md" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2 mb-2">
				<span class="text-(--color-base-content)">
					{@html DatabasePoint({ theme: 'outline', size: '20', strokeWidth: 3 })}
				</span>
				<h3 class="text-base font-semibold text-(--color-base-content)">Indices</h3>
			</div>
		{/snippet}
		
		<div class="space-y-2">
			<div>
				<p class="text-xs text-(--color-base-content) opacity-60 uppercase tracking-wide">Documents</p>
				<p class="text-2xl font-bold text-(--color-base-content)">{dashboardData.index_metrics?.document_count?.toLocaleString() || 0}</p>
			</div>
			<div>
				<p class="text-xs text-(--color-base-content) opacity-60 uppercase tracking-wide">Storage</p>
				<p class="text-lg font-semibold text-(--color-base-content)">{dashboardData.index_metrics?.disk_usage || '0 B'}</p>
			</div>
		</div>
	</Card>
</div>
