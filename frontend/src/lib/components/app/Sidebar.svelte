<script lang="ts">
  import { sidebarExpanded } from '$lib/stores/sidebar';
  import SideBarHeader from '$lib/components/ui/sideBarComponents/SideBarHeader.svelte';
  import SideBarMenuItem from '$lib/components/ui/sideBarComponents/SideBarMenuItem.svelte';
  import { Popover } from '$lib/components/ui/popoverComponents';
  import ThemeSwitcher from '$lib/components/ui/formComponents/ThemeSwitcher.svelte';
  
  interface SidebarProps {
    onExpand?: (isExpanded: boolean) => void;
  }
  
  let { onExpand }: SidebarProps = $props();
  import { 
    Home,
    Connect,
    Setting, 
    Search,
    Server,
    ApiApp,
    DatabasePoint,
    DatabaseDownload,
    Info,
    Close,
  } from '@icon-park/svg';
  import { page } from '$app/state';


  let expanded = $derived($sidebarExpanded);
  let keepOpen = $state(false);
  let hoverTimeout = $state<NodeJS.Timeout | null>(null);
  let sidebar_icon_theme: 'outline' | 'filled' = 'outline';
  let sidebar_icon_size = 20;
  let stroke_width = 3.8;

  const menuItems = [
    { icon: Home({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Home', url: '/' },
    { icon: Connect({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Nodes', url: '/nodes' },
    { icon: Server({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Shards', url: '/shards' },
    { icon: DatabasePoint({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Indices', url: '/indices' },
    { icon: Search({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Search', url: '/search' },
    { icon: ApiApp({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'APIs', url: '/rest' },
    { icon: DatabaseDownload({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Snapshots', url: '/snapshots' },
    { icon: Info({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'Info', url: '/about' }
  ];
  let settingsOpen = $state(false);
  let triggerElement = $state<HTMLElement>();

  const currentUrl = $derived(page.url.pathname);

  // Smoothly reposition popover during sidebar animation
  $effect(() => {
    if (triggerElement && settingsOpen && expanded !== undefined) {
      // Multiple position updates during the sidebar transition for smooth movement
      const updateTimes = [0, 50, 100, 150, 200, 250, 300, 350];
      
      updateTimes.forEach(delay => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, delay);
      });
    }
  });

  // Handle clicks outside popover (but allow theme switcher clicks)
  $effect(() => {
    if (!settingsOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const popoverElement = document.querySelector('[role="dialog"]');
      const triggerButton = triggerElement;
      
      // Check if click is on theme switcher
      const isThemeSwitcher = target.closest('.theme-switcher-wrapper') || 
                             target.closest('.theme-switcher-container') ||
                             target.classList.contains('theme-switcher-input');
      
      // Check if click is inside popover or on trigger
      const isInsidePopover = popoverElement?.contains(target);
      const isOnTrigger = triggerButton?.contains(target);
      
      if (!isInsidePopover && !isOnTrigger && !isThemeSwitcher) {
        settingsOpen = false;
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  function handleBrandClick() {
    keepOpen = !keepOpen;
    sidebarExpanded.set(keepOpen);
    onExpand?.(keepOpen);
  }

  function handleMouseEnter() {
    if (!keepOpen) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      sidebarExpanded.set(true);
      onExpand?.(true);
    }
  }

  function handleMouseLeave() {
    if (!keepOpen) {
      hoverTimeout = setTimeout(() => {
        sidebarExpanded.set(false);
        onExpand?.(false);
      }, 120);
    }
  }
</script>

<aside
  class="fixed left-0 top-7 z-30 h-[calc(100vh-32px)] flex flex-col justify-between bg-(--color-base-100) transition-all duration-300 border-r border-r-(--color-base-300)"
  style="width: {expanded ? '220px' : '56px'};"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
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
  
  <!-- Settings Section with Popover -->
  <Popover 
    bind:open={settingsOpen} 
    placement="right-end" 
    offset={8}
    arrow={true}
    closeOnOutsideClick={false}
  >
    {#snippet trigger()}
      <button
        bind:this={triggerElement}
        class="relative flex items-center gap-2 px-4 py-2 cursor-pointer group w-full text-left focus:outline-none focus-visible:ring hover:bg-(--color-base-300) mb-6"
        style="color: var(--color-base-content);"
        aria-label="Settings"
        tabindex="0"
      >
        <span class="w-8 h-8 flex items-center justify-center text-(--color-base-content)">
          {@html Setting({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width})}
        </span>
        {#if expanded}
          <span class="text-base font-medium text-(--color-base-content)">Settings</span>
        {/if}
      </button>
    {/snippet}
      
      <div class="min-w-48 p-3 relative">
        <!-- Close button in top-right -->
        <button 
          class="absolute top-2 right-2 p-1 rounded transition-colors hover:bg-base-200 close-button"
          style="color: var(--color-base-content);"
          onclick={() => settingsOpen = false}
          aria-label="Close settings"
        >
          {@html Close({ theme: 'outline', size: 16, strokeWidth: 2 })}
        </button>

        <h3 class="font-semibold mb-3 text-base pr-6" style="color: var(--color-base-content);">
          Settings
        </h3>
        
        <!-- Compact Theme Row -->
        <div class="flex items-center justify-between w-full">
          <span class="text-sm font-medium shrink-0" style="color: var(--color-base-content);">
            Theme
          </span>
          <div class="ml-auto">
            <ThemeSwitcher 
              onchange={(isDark) => {
                console.log('Theme changed to:', isDark ? 'dark' : 'light');
                // Wait for animation to complete before closing popover
                setTimeout(() => {
                  settingsOpen = false;
                }, 700); // 300ms animation + 100ms buffer
              }}
            />
          </div>
        </div>
      </div>
  </Popover>
</aside>

<style>
  .close-button:hover {
    background-color: var(--color-base-200);
  }
  
  .close-button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>
