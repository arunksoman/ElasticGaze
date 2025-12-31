<script lang="ts">
	import Card from '$lib/components/ui/Card/Card.svelte';
	import { Info, CheckOne, Attention, CloseOne } from '@icon-park/svg';
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

<div class="space-y-6">
	<!-- Cluster Information -->
	<Card variant="outlined" padding="lg" border={true}>
		{#snippet header()}
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-(--color-base-content)">
						{@html Info({ theme: 'outline', size: '24', strokeWidth: 3 })}
					</span>
					<h2 class="text-xl font-bold text-(--color-base-content)">Cluster Information</h2>
				</div>
			</div>
		{/snippet}
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Node Name</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.name || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Cluster Name</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.cluster_name || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Cluster UUID</p>
				<p class="text-base font-mono text-(--color-base-content) break-all">{dashboardData.cluster_info?.cluster_uuid || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Tagline</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.tagline || 'N/A'}</p>
			</div>
		</div>
	</Card>
	
	<!-- Version Information -->
	<Card variant="outlined" padding="lg" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2">
				<span class="text-(--color-base-content)">
					{@html Info({ theme: 'outline', size: '24', strokeWidth: 3 })}
				</span>
				<h2 class="text-xl font-bold text-(--color-base-content)">Version Information</h2>
			</div>
		{/snippet}
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Version</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.version?.number || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Build Type</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.version?.build_type || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Lucene Version</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.version?.lucene_version || 'N/A'}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Build Date</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_info?.version?.build_date || 'N/A'}</p>
			</div>
		</div>
	</Card>
	
	<!-- Cluster Health -->
	<Card variant="outlined" padding="lg" border={true}>
		{#snippet header()}
			<div class="flex items-center gap-2">
				<span style="color: {getHealthColor(dashboardData.cluster_health?.status || 'green')}">
					{@html getHealthIcon(dashboardData.cluster_health?.status || 'green')}
				</span>
				<h2 class="text-xl font-bold text-(--color-base-content)">Cluster Health</h2>
			</div>
		{/snippet}
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Status</p>
				<div class="flex items-center gap-2">
					<span style="color: {getHealthColor(dashboardData.cluster_health?.status || 'green')}">
						{@html getHealthIcon(dashboardData.cluster_health?.status || 'green')}
					</span>
					<p class="text-base font-semibold capitalize" style="color: {getHealthColor(dashboardData.cluster_health?.status || 'green')}">
						{dashboardData.cluster_health?.status || 'Unknown'}
					</p>
				</div>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Active Shards</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_health?.active_shards || 0}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Relocating Shards</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_health?.relocating_shards || 0}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Unassigned Shards</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_health?.unassigned_shards || 0}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Pending Tasks</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_health?.number_of_pending_tasks || 0}</p>
			</div>
			<div>
				<p class="text-sm text-(--color-base-content) opacity-60 uppercase tracking-wide mb-1">Active Shards %</p>
				<p class="text-base font-medium text-(--color-base-content)">{dashboardData.cluster_health?.active_shards_percent_as_number?.toFixed(1) || 0}%</p>
			</div>
		</div>
	</Card>
</div>
