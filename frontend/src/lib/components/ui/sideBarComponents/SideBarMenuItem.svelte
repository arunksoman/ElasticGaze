<script lang="ts">
  export let icon: any;
  export let name: string;
  export let url: string;
  export let expanded: boolean;
  export let active: boolean;
  import { goto } from '$app/navigation';
  
  let hovered = false;

  function handleClick() {
    if (url) goto(url);
  }
</script>

<button
  class="relative flex items-center gap-2 px-4 py-2 cursor-pointer group w-full text-left focus:outline-none focus-visible:ring hover:bg-(--color-base-300)"
  aria-current={active ? 'page' : undefined}
  aria-label={name}
  tabindex="0"
  onclick={handleClick}
  onmouseenter={() => hovered = true}
  onmouseleave={() => hovered = false}
>
  <span class="w-8 h-8 flex items-center justify-center text-(--color-base-content)">
    {@html icon}
    {#if hovered && !expanded}
      <span class="absolute left-full ml-2 px-2 py-1 rounded bg-(--color-base-300) text-xs text-(--color-base-content) shadow-lg z-50">{name}</span>
    {/if}
  </span>
  {#if expanded}
    <span class="text-base font-medium text-(--color-base-content)">{name}</span>
  {/if}
  {#if active}
    <span class="absolute left-0 top-0 h-full w-1 bg-(--color-primary)"></span>
  {/if}
</button>
