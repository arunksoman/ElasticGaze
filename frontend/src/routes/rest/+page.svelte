<script>
	import DefaultConnectionMessage from '$lib/components/app/DefaultConnectionMessage.svelte';
	import { page } from '$app/stores';
</script>

<div class="max-w-6xl ml-4 mt-4">
    <h1 class="text-2xl font-bold">Rest</h1>
    <DefaultConnectionMessage currentPath={$page.url.pathname} />
</div>