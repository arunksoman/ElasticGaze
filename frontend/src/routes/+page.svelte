<script lang="ts">
	import { page } from '$app/state';
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
</script>

<div class="max-w-6xl ml-4 mt-4">
	<h1 class="text-2xl font-bold text-(--color-base-content)">Dashboard</h1>
	
	<DefaultConnectionMessage currentPath={page.url.pathname}>
		<!-- Dashboard content only renders when connection is successful -->
		<div class="mt-4">
			<p class="text-(--color-base-content)">Dashboard content will be displayed here...</p>
			<!-- Add your dashboard widgets and data here -->
		</div>
	</DefaultConnectionMessage>
</div>
