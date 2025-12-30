<script lang="ts">
	import DefaultConnectionMessage from './DefaultConnectionMessage.svelte';
	import { page } from '$app/state';
	
	let { children } = $props();
</script>

<DefaultConnectionMessage currentPath={page.url.pathname} />
{@render children?.()}
