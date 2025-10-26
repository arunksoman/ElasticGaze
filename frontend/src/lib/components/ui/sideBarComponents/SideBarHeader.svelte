<script lang="ts">
  export let expanded: boolean;
  export let onBrandClick: () => void;
//   import eg_logo from '/icons/eg_icon1.svg';
</script>

<button
  class="flex items-center gap-2 px-4 py-3 cursor-pointer w-full focus:outline-none focus-visible:ring"
  aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
  aria-expanded={expanded}
  tabindex="0"
  onclick={onBrandClick}
>
  <span class="w-8 h-8 flex items-center justify-center">
    <img src="/icons/eg_icon1.svg" alt="ElasticGaze Logo" class="w-6 h-6"/>
  </span>
  {#if expanded}
    <span class="text-lg font-bold text-(--color-base-content)">ElasticGaze</span>
  {/if}
</button>
