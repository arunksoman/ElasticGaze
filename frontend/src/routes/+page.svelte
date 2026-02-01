<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import DashboardSummaryCards from '$lib/components/app/DashboardSummaryCards.svelte';
	import DashboardDetailedInfo from '$lib/components/app/DashboardDetailedInfo.svelte';
	import { Button } from 'chathuram/form';
	import { GetClusterDashboardData, GetDefaultConfig } from '$lib/wailsjs/go/main/App';
	import type { models } from '$lib/wailsjs/go/models';
	
	let dashboardData = $state<models.ProcessedDashboardData | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let showDetails = $state(false);
	let isLargeScreen = $state(false);
	
	// Check screen size
	function checkScreenSize() {
		isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
		if (isLargeScreen) {
			showDetails = true; // Always show details on large screens
		}
	}
	
	async function loadDashboardData() {
		isLoading = true;
		error = null;
		
		try {
			// Get default config
			const config = await GetDefaultConfig();
			
			// Fetch dashboard data
			const data = await GetClusterDashboardData(config.id);
			dashboardData = data;
		} catch (err) {
			console.error('Error loading dashboard data:', err);
			error = String(err);
		} finally {
			isLoading = false;
		}
	}
	
	onMount(() => {
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		loadDashboardData();
		
		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	});
</script>

<div class="max-w-7xl ml-4 mt-4 mr-4 pb-8">
	<DefaultConnectionMessage currentPath={page.url.pathname}>
		<!-- Header with Show Details Button -->
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-2xl font-bold text-(--color-base-content)">Dashboard</h1>
			
			<!-- Show Details Button (only on smaller screens) -->
			{#if !isLargeScreen && dashboardData}
				<Button 
					variant={showDetails ? 'outline' : 'accent'}
					size="sm"
					onclick={() => showDetails = !showDetails}
				>
					{showDetails ? 'Show Summary' : 'Show Details'}
				</Button>
			{/if}
		</div>
		
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<p class="text-(--color-base-content) opacity-70">Loading dashboard data...</p>
			</div>
		{:else if error}
			<div class="flex items-center justify-center py-12">
				<p class="text-red-500">Error loading dashboard: {error}</p>
			</div>
		{:else if dashboardData}
			<!-- Dashboard Cards Grid -->
			<DashboardSummaryCards {dashboardData} />
			
			<!-- Detailed Information (shown based on screen size or button click) -->
			{#if showDetails}
				<div class="mt-6">
					<DashboardDetailedInfo {dashboardData} />
				</div>
			{/if}
		{/if}
	</DefaultConnectionMessage>
</div>
