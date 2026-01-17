<script lang="ts">
import { Minus, Close, ExpandTextInput, CollapseTextInput, Api } from "@icon-park/svg";
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { WindowIsMaximised, WindowMaximise, WindowUnmaximise, WindowMinimise, Quit } from "$lib/wailsjs/runtime/runtime.js";
import { writable } from 'svelte/store';

const isMaximized = writable(false);
let closeHover = false;

onMount(async () => {
  isMaximized.set(await WindowIsMaximised());
});

async function handleMaximize() {
  await WindowMaximise();
  isMaximized.set(true);
}

async function handleRestore() {
  await WindowUnmaximise();
  isMaximized.set(false);
}

async function handleMinimize() {
  await WindowMinimise();
  isMaximized.set(false);
}

async function handleClose() {
  await Quit();
}
</script>


<div
  class="flex items-center fixed top-0 z-50 justify-end h-7 w-full select-none bg-(--color-base-100) text-(--color-base-content)"
  style="--wails-draggable:drag;"
>
  <button
    class="w-8 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-(--color-base-200)"
    style="--wails-draggable:no-drag;"
    aria-label="Connections"
    onclick={() => goto('/connections')}
  >
    <span class="w-5 h-5 flex items-center justify-center">
  {@html Api({ theme: 'outline', size: 16, fill: 'var(--color-base-content)' })}
    </span>
  </button>
  <button
    class="w-8 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-(--color-base-200)"
    style="--wails-draggable:no-drag;"
    aria-label="Minimize"
    onclick={handleMinimize}
  >
    <span class="w-5 h-5 flex items-center justify-center">
  {@html Minus({ theme: 'outline', size: 16, fill: 'var(--color-base-content)' })}
    </span>
  </button>
  {#if $isMaximized}
    <button
      class="w-8 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-(--color-base-200)"
      style="--wails-draggable:no-drag;"
      aria-label="Restore"
      onclick={handleRestore}
    >
      <span class="w-5 h-5 flex items-center justify-center">
  {@html CollapseTextInput({ theme: 'outline', size: 12, fill: 'var(--color-base-content)' })}
      </span>
    </button>
  {:else}
    <button
      class="w-8 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-(--color-base-200)"
      style="--wails-draggable:no-drag;"
      aria-label="Maximize"
      onclick={handleMaximize}
    >
      <span class="w-5 h-5 flex items-center justify-center">
  {@html ExpandTextInput({ theme: 'outline', size: 12, fill: 'var(--color-base-content)' })}
      </span>
    </button>
  {/if}
  <button
    class="w-8 h-7 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-(--color-base-200)"
    style="--wails-draggable:no-drag;"
    aria-label="Close"
    onclick={handleClose}
    onmouseenter={() => closeHover = true}
    onmouseleave={() => closeHover = false}
  >
    <span class="w-5 h-5 flex items-center justify-center">
  {@html Close({ theme: 'outline', size: 12, fill: closeHover ? '#e53935' : 'var(--color-base-content)' })}
    </span>
  </button>
</div>

