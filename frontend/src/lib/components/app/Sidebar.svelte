<script lang="ts">
  import { sidebarExpanded } from '$lib/stores/sidebar';
  import SideBarHeader from '$lib/components/ui/sideBarComponents/SideBarHeader.svelte';
  import SideBarMenuItem from '$lib/components/ui/sideBarComponents/SideBarMenuItem.svelte';
  import SideBarFooter from '$lib/components/ui/sideBarComponents/SideBarFooter.svelte';
  
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
  const footerItems = [
    { icon: Setting({ theme: sidebar_icon_theme, size: sidebar_icon_size, strokeWidth: stroke_width}), name: 'About', url: '/about' },
  ];

  const currentUrl = $derived(page.url.pathname);

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
  <SideBarFooter items={footerItems} expanded={expanded} />
</aside>
