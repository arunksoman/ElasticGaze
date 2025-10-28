<script lang="ts">
  import { createToast } from './toastStore';
  import type { ToastProps } from './types';
  import Toast from './toast.svelte';

  let { children } = $props();
  const toast = createToast();
  let toasts = $state<ToastProps[]>([]);
  
  $effect(() => {
    toasts = toast.toasts;
  });
</script>

<div class="fixed bottom-4 right-4 z-50">
  {#each toasts as toast}
    <Toast {...toast} />
  {/each}
</div>

{@render children?.()}