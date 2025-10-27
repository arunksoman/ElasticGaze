<script lang="ts">
  export let items: Array<{ icon: any; name: string; url?: string }> = [];
  export let expanded: boolean;
  import { goto } from '$app/navigation';
</script>

<div class="flex flex-col gap-2 px-4 py-3 text-(--color-base-content)" role="contentinfo">
  {#each items as item}
    {#if item.url}
      <button
        class="flex items-center gap-2 cursor-pointer w-full text-left focus:outline-none focus-visible:ring"
        onclick={() => { if (item.url) goto(item.url); }}
        aria-label={item.name}
        tabindex="0"
      >
        <span class="w-6 h-6 flex items-center justify-center">{@html item.icon}</span>
        {#if expanded}
          <span class="text-base text-(--color-base-content)">{item.name}</span>
        {/if}
      </button>
    {:else}
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 flex items-center justify-center">{@html item.icon}</span>
        {#if expanded}
          <span class="text-base text-(--color-base-content)">{item.name}</span>
        {/if}
      </div>
    {/if}
  {/each}
</div>
