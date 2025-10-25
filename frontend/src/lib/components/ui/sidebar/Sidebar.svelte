<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { sidebarExpanded } from '$lib/stores/sidebar';
  import SideBarHeader from './SideBarHeader.svelte';
  import SideBarMenuItem from './SideBarMenuItem.svelte';
  import SideBarFooter from './SideBarFooter.svelte';
  import { Home, Setting } from '@icon-park/svg';
  import { page } from '$app/stores';
  let expanded = false;
  $: expanded = $sidebarExpanded;
  const dispatch = createEventDispatcher();
  let keepOpen = false;
  let hoverTimeout: NodeJS.Timeout | null = null;

  const menuItems = [
    { icon: Home({ theme: 'outline', size: 24 }), name: 'Home', url: '/' },
    { icon: Setting({ theme: 'outline', size: 24 }), name: 'Settings', url: '/settings' },
  ];
  const footerItems = [
    { icon: Setting({ theme: 'outline', size: 24 }), name: 'About', url: '/about' },
  ];

  function handleBrandClick() {
    keepOpen = !keepOpen;
    sidebarExpanded.set(keepOpen);
    dispatch('update:expanded', keepOpen);
  }

  function handleMouseEnter() {
    if (!keepOpen) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      sidebarExpanded.set(true);
      dispatch('update:expanded', true);
    }
  }
  function handleMouseLeave() {
    if (!keepOpen) {
      hoverTimeout = setTimeout(() => {
        sidebarExpanded.set(false);
        dispatch('update:expanded', false);
      }, 120);
    }
  }

  $: currentUrl = $page.url.pathname;
</script>

<aside
  class="fixed left-0 top-0 z-30 h-screen flex flex-col justify-between bg-[var(--color-base-200)] transition-all duration-300"
  style="width: {expanded ? '220px' : '56px'};"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  role="navigation"
  aria-label="Main sidebar"
>
  <div>
  <SideBarHeader {expanded} onBrandClick={handleBrandClick} />
    <nav class="mt-2 flex flex-col gap-1" aria-label="Sidebar menu">
      {#each menuItems as item}
        <SideBarMenuItem
          icon={item.icon}
          name={item.name}
          url={item.url}
          expanded={expanded}
          active={currentUrl === item.url}
        />
      {/each}
    </nav>
  </div>
  <SideBarFooter items={footerItems} expanded={expanded} />
</aside>
