<!-- @ts-nocheck -->
<script lang="ts">
  import Card from '$lib/components/ui/Card/Card.svelte';
  import Button from '$lib/components/ui/formComponents/Button.svelte';
  import { Copy, Setting, Check, Delete } from '@icon-park/svg';
  import { toastStore } from '$lib/components/ui/toastComponent/toastStore';

  function handleCardClick(message: string) {
    toastStore.show(message, { type: 'info' });
  }
</script>

<div class="min-h-screen p-8" style="background-color: var(--color-base-200);">
  <div class="max-w-7xl mx-auto space-y-12">
    
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-2" style="color: var(--color-base-content);">
        Card Component Demo
      </h1>
      <p class="opacity-70" style="color: var(--color-base-content);">
        Versatile cards with variants, elevation, slots, and interactivity
      </p>
    </div>

    <!-- Variants -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Variants
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Default -->
        <Card>
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Default Variant
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              Filled background
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            Uses <code>--color-base-100</code> for background.
          </p>
        </Card>

        <!-- Outlined -->
        <Card variant="outlined">
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Outlined Variant
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              Transparent with border
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            Transparent background with <code>--color-base-300</code> border.
          </p>
        </Card>

        <!-- Ghost -->
        <Card variant="ghost">
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Ghost Variant
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              Minimal styling
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            Transparent background, no border.
          </p>
        </Card>

      </div>
    </section>

    <!-- Elevation Levels -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Elevation System (0-5)
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        
        {#each [0, 1, 2, 3, 4, 5] as level}
          <Card elevation={level} padding="md" rounded>
            <div class="text-center">
              <div class="text-3xl font-bold mb-1" style="color: var(--color-base-content);">
                {level}
              </div>
              <p class="text-xs opacity-70" style="color: var(--color-base-content);">
                Elevation
              </p>
            </div>
          </Card>
        {/each}

      </div>
    </section>

    <!-- Clickable Cards -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Clickable & Interactive
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Clickable Card -->
        <Card 
          clickable 
          elevation={1}
          padding="md" 
          rounded
          onclick={() => handleCardClick('Clickable card activated!')}
        >
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Clickable Card
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              Try clicking or using Enter/Space
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            This card has hover lift effect, focus outline, and keyboard support.
          </p>
          <div slot="actions">
            <Button variant="primary" size="sm">Action</Button>
          </div>
        </Card>

        <!-- Card with href -->
        <Card 
          href="/search" 
          elevation={1}
          padding="md" 
          rounded
        >
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Card as Link
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              Click to navigate to /search
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            This card renders as an <code>&lt;a&gt;</code> element for navigation.
          </p>
          <div slot="actions">
            <span class="text-sm" style="color: var(--color-primary);">
              Go to search →
            </span>
          </div>
        </Card>

      </div>
    </section>

    <!-- Accent Strips -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Accent Strips
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Accent -->
        <Card accent="left" padding="lg" border rounded elevation={1}>
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Left Accent Strip
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              3px accent bar on the left
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            Great for highlighting important items in a list or emphasizing status.
          </p>
        </Card>

        <!-- Top Accent -->
        <Card accent="top" padding="lg" border rounded elevation={1}>
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Top Accent Strip
            </h3>
            <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
              4px accent bar on top
            </p>
          </div>
          <p style="color: var(--color-base-content);">
            Perfect for featured content or category-based organization.
          </p>
        </Card>

      </div>
    </section>

    <!-- Media Slots -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Media Slot Examples
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Card with Image Placeholder -->
        <Card padding="none" rounded elevation={2}>
          <div slot="media">
            <div 
              class="w-full h-48 flex items-center justify-center"
              style="background: linear-gradient(135deg, var(--color-primary), var(--color-accent));"
            >
              <span class="text-white text-4xl font-bold">IMG</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
              Full-bleed Image
            </h3>
            <p class="text-sm mt-2" style="color: var(--color-base-content);">
              padding="none" allows images to fill edge-to-edge.
            </p>
          </div>
        </Card>

        <!-- Card with Icon -->
        <Card padding="md" rounded elevation={2} border>
          <div slot="media">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style="background-color: var(--color-accent);"
            >
              <div>{@html Setting({ theme: 'outline', size: '32', strokeWidth: 3, fill: 'var(--color-accent-content)' })}</div>
            </div>
          </div>
          <div class="mt-4 text-center">
            <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
              Icon in Media
            </h3>
            <p class="text-sm text-center mt-2" style="color: var(--color-base-content);">
              Use media slot for icons, badges, or decorative elements.
            </p>
          </div>
        </Card>

        <!-- Card with Gradient Background -->
        <Card padding="none" rounded elevation={2}>
          <div slot="media">
            <div 
              class="w-full h-32 flex items-center justify-center"
              style="background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));"
            >
              <span class="text-white text-xl font-bold">Gradient</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
              Gradient Header
            </h3>
            <p class="text-sm mt-2" style="color: var(--color-base-content);">
              Media slot can hold any content, not just images.
            </p>
          </div>
        </Card>

      </div>
    </section>

    <!-- Dashboard Stats Cards -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Dashboard Stats (Outlined Variant)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <!-- Total Users -->
        <Card variant="outlined" padding="md" rounded>
          <div slot="header">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium opacity-70" style="color: var(--color-base-content);">
                Total Users
              </h4>
              <span class="text-sm font-bold" style="color: var(--color-success);">+12%</span>
            </div>
          </div>
          <div class="text-3xl font-bold mt-2" style="color: var(--color-base-content);">
            24,583
          </div>
        </Card>

        <!-- Revenue -->
        <Card variant="outlined" padding="md" rounded>
          <div slot="header">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium opacity-70" style="color: var(--color-base-content);">
                Revenue
              </h4>
              <span class="text-sm font-bold" style="color: var(--color-success);">+8%</span>
            </div>
          </div>
          <div class="text-3xl font-bold mt-2" style="color: var(--color-base-content);">
            $128.4K
          </div>
        </Card>

        <!-- Active Sessions -->
        <Card variant="outlined" padding="md" rounded>
          <div slot="header">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium opacity-70" style="color: var(--color-base-content);">
                Sessions
              </h4>
              <span class="text-sm font-bold" style="color: var(--color-warning);">-3%</span>
            </div>
          </div>
          <div class="text-3xl font-bold mt-2" style="color: var(--color-base-content);">
            1,842
          </div>
        </Card>

        <!-- Conversion Rate -->
        <Card variant="outlined" padding="md" rounded>
          <div slot="header">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium opacity-70" style="color: var(--color-base-content);">
                Conversion
              </h4>
              <span class="text-sm font-bold" style="color: var(--color-success);">+5%</span>
            </div>
          </div>
          <div class="text-3xl font-bold mt-2" style="color: var(--color-base-content);">
            3.24%
          </div>
        </Card>

      </div>
    </section>

    <!-- Feature Cards -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Feature Cards (Top Accent)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Fast Performance -->
        <Card accent="top" padding="lg" border rounded elevation={1}>
          <div slot="header">
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" 
                style="background-color: var(--color-accent); color: var(--color-accent-content);"
              >
                <span class="text-2xl">🚀</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
                  Fast Performance
                </h3>
                <p class="text-sm opacity-70" style="color: var(--color-base-content);">
                  Lightning speed
                </p>
              </div>
            </div>
          </div>
          <p class="mt-4" style="color: var(--color-base-content);">
            Optimized infrastructure ensures peak performance.
          </p>
        </Card>

        <!-- Secure -->
        <Card accent="top" padding="lg" border rounded elevation={1}>
          <div slot="header">
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" 
                style="background-color: var(--color-accent); color: var(--color-accent-content);"
              >
                <span class="text-2xl">🔒</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
                  Enterprise Security
                </h3>
                <p class="text-sm opacity-70" style="color: var(--color-base-content);">
                  Bank-level encryption
                </p>
              </div>
            </div>
          </div>
          <p class="mt-4" style="color: var(--color-base-content);">
            Your data is protected with industry-leading security measures.
          </p>
        </Card>

        <!-- 24/7 Support -->
        <Card accent="top" padding="lg" border rounded elevation={1}>
          <div slot="header">
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" 
                style="background-color: var(--color-accent); color: var(--color-accent-content);"
              >
                <span class="text-2xl">💬</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
                  24/7 Support
                </h3>
                <p class="text-sm opacity-70" style="color: var(--color-base-content);">
                  Always available
                </p>
              </div>
            </div>
          </div>
          <p class="mt-4" style="color: var(--color-base-content);">
            Our support team is here to help you anytime, anywhere.
          </p>
        </Card>

      </div>
    </section>

    <!-- Product Cards -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Product Cards
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {#each [
          { name: 'Premium Headphones', price: '$299.99', emoji: '🎧' },
          { name: 'Wireless Mouse', price: '$79.99', emoji: '🖱️' },
          { name: 'Mechanical Keyboard', price: '$149.99', emoji: '⌨️' }
        ] as product}
          <Card padding="none" rounded elevation={2}>
            <div slot="media">
              <div 
                class="w-full h-48 flex items-center justify-center"
                style="background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));"
              >
                <span class="text-6xl">{product.emoji}</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold" style="color: var(--color-base-content);">
                {product.name}
              </h3>
              <p class="text-xl font-bold mt-1" style="color: var(--color-primary);">
                {product.price}
              </p>
              <p class="text-sm mt-2 mb-4" style="color: var(--color-base-content);">
                High-quality product with premium features and design.
              </p>
              <Button variant="primary" size="sm" class="w-full">Add to Cart</Button>
            </div>
          </Card>
        {/each}

      </div>
    </section>

    <!-- Article Cards -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Article Preview Cards
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {#each [
          { category: 'TUTORIAL', title: 'Getting Started with Svelte 5', description: 'Learn the new runes syntax and build modern applications...', readTime: '5 min', date: 'Nov 8, 2025' },
          { category: 'GUIDE', title: 'Mastering Wails Framework', description: 'Build cross-platform desktop apps with Go and JavaScript...', readTime: '8 min', date: 'Nov 7, 2025' }
        ] as article}
          <Card 
            href="/about"
            variant="outlined" 
            padding="md" 
            rounded
          >
            <div slot="header">
              <span class="text-xs font-bold" style="color: var(--color-accent);">
                {article.category}
              </span>
              <h3 class="text-lg font-semibold mt-1" style="color: var(--color-base-content);">
                {article.title}
              </h3>
            </div>
            <p class="mt-2 text-sm" style="color: var(--color-base-content);">
              {article.description}
            </p>
            <div slot="footer" class="flex items-center justify-between text-xs">
              <span style="color: var(--color-base-content);">{article.readTime} read</span>
              <span style="color: var(--color-base-content);">{article.date}</span>
            </div>
          </Card>
        {/each}

      </div>
    </section>

    <!-- Rounded vs Flat -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Rounded vs Flat
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Flat -->
        <Card rounded={false} elevation={2} padding="md" border>
          <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
            Flat Edges
          </h3>
          <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
            Uses --radius-box (0rem)
          </p>
          <p class="mt-2" style="color: var(--color-base-content);">
            Perfect for dashboards, admin interfaces, and data-heavy UIs.
          </p>
        </Card>

        <!-- Rounded -->
        <Card rounded={true} elevation={2} padding="md" border>
          <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
            Rounded Corners
          </h3>
          <p class="text-sm opacity-70 mt-1" style="color: var(--color-base-content);">
            Uses --radius-selector (1rem)
          </p>
          <p class="mt-2" style="color: var(--color-base-content);">
            Great for marketing pages, landing pages, and friendly UIs.
          </p>
        </Card>

      </div>
    </section>

    <!-- Action Cards with Footer -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Cards with Footer & Actions
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Confirmation Card -->
        <Card elevation={2} padding="md" rounded border>
          <div slot="header">
            <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
              Confirm Action
            </h3>
          </div>
          <p style="color: var(--color-base-content);">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div slot="actions" class="flex gap-2">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button variant="primary" size="sm" icon="Delete">
              Delete
            </Button>
          </div>
          <div slot="footer">
            <span class="text-xs opacity-70" style="color: var(--color-base-content);">
              Last modified: 2 hours ago
            </span>
          </div>
        </Card>

        <!-- Success Card -->
        <Card elevation={2} padding="md" rounded border accent="left">
          <div slot="header">
            <div class="flex items-center gap-2">
              <div>{@html Check({ theme: 'filled', size: '24', fill: 'var(--color-success)' })}</div>
              <h3 class="text-xl font-semibold" style="color: var(--color-base-content);">
                Success!
              </h3>
            </div>
          </div>
          <p style="color: var(--color-base-content);">
            Your changes have been saved successfully.
          </p>
          <div slot="actions">
            <Button variant="primary" size="sm">Continue</Button>
          </div>
          <div slot="footer">
            <span class="text-xs opacity-70" style="color: var(--color-base-content);">
              Saved at {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>

      </div>
    </section>

    <!-- Padding Variations -->
    <section>
      <h2 class="text-2xl font-bold mb-6" style="color: var(--color-base-content);">
        Padding Options
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <Card padding="none" border rounded elevation={1}>
          <div class="p-2">
            <h4 class="text-sm font-semibold" style="color: var(--color-base-content);">None</h4>
            <p class="text-xs mt-1" style="color: var(--color-base-content);">
              No padding
            </p>
          </div>
        </Card>

        <Card padding="sm" border rounded elevation={1}>
          <h4 class="text-sm font-semibold" style="color: var(--color-base-content);">Small</h4>
          <p class="text-xs mt-1" style="color: var(--color-base-content);">
            0.75rem (12px)
          </p>
        </Card>

        <Card padding="md" border rounded elevation={1}>
          <h4 class="text-sm font-semibold" style="color: var(--color-base-content);">Medium</h4>
          <p class="text-xs mt-1" style="color: var(--color-base-content);">
            1rem (16px)
          </p>
        </Card>

        <Card padding="lg" border rounded elevation={1}>
          <h4 class="text-sm font-semibold" style="color: var(--color-base-content);">Large</h4>
          <p class="text-xs mt-1" style="color: var(--color-base-content);">
            1.5rem (24px)
          </p>
        </Card>

      </div>
    </section>

  </div>
</div>

<style>
  code {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: ui-monospace, monospace;
    background-color: var(--color-base-300);
    color: var(--color-base-content);
  }
</style>
