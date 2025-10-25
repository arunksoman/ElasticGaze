<script lang="ts">
  export let expanded: boolean;
  export let onBrandClick: () => void;
  import { Home } from '@icon-park/svg'; // Replace with your brand icon if available
</script>

<button
  class="flex items-center gap-2 px-4 py-3 cursor-pointer w-full focus:outline-none focus-visible:ring"
  aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
  aria-expanded={expanded}
  tabindex="0"
  on:click={onBrandClick}
>
  <span class="w-8 h-8 flex items-center justify-center">{@html Home({ theme: 'outline', size: 32 })}</span>
  {#if expanded}
    <span class="text-lg font-bold text-[var(--color-base-content)]">ElasticGaze</span>
  {/if}
</button>
