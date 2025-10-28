<script lang="ts">
  import { Close } from '@icon-park/svg';
  import type { ToastProps } from './types';

  const typeColorMap = {
    info: '--color-info',
    success: '--color-success',
    warning: '--color-warning',
    error: '--color-error'
  } as const;

  let props = $props();
  let type = props.type ?? 'info';
  let title = props.title;
  let description = props.description;
  let duration = props.duration ?? 5000;
  let hasClose = props.hasClose ?? true;
  let onClose = props.onClose;

  const colorVar = typeColorMap[type as keyof typeof typeColorMap];
</script>

<div
  class="relative flex gap-3 items-start p-4 min-w-[320px] rounded shadow-lg bg-(--color-base-200) border border-(--color-base-300) mb-2"
>
  <!-- Left border color indicator -->
  <div class="absolute left-0 top-0 h-full w-1" style:background-color="var({colorVar})"></div>

  <!-- Content area with left padding to account for color indicator -->
  <div class="flex-1 pl-2">
    {#if title}
      <div class="text-sm font-medium text-(--color-base-content)">
        {title}
      </div>
    {/if}
    {#if description}
      <div class="mt-1 text-sm text-(--color-base-content/0.8)">
        {description}
      </div>
    {/if}
  </div>

  {#if hasClose}
    <button 
      class="flex-none p-1 rounded-full hover:bg-(--color-base-300) text-(--color-base-content/0.6) hover:text-(--color-base-content) transition-colors"
      onclick={onClose}
    >
      {@html Close({ theme: 'outline', size: 16 })}
    </button>
  {/if}
</div>
