# Form Components

A complete set of themeable, reusable form components for ElasticGaze built with **Svelte 5** (runes syntax). All components are styled using CSS variables from `app.css`, ensuring consistent theming across light and dark modes.

## Features

✅ **Fully themed** - Uses existing `app.css` CSS variables  
✅ **Svelte 5 runes** - Modern reactive syntax with `$state`, `$derived`, `$bindable`  
✅ **TypeScript support** - Full type definitions  
✅ **Accessible** - WCAG compliant with ARIA attributes and keyboard navigation  
✅ **Icon support** - IconPark SVG icons integrated  
✅ **Flat design** - Uses `--radius-field`, `--radius-selector`, `--radius-box` from theme  
✅ **Responsive** - Works on all screen sizes  
✅ **Production ready** - Battle-tested patterns

---

## Components

### 1. Button
A versatile button component with multiple variants, sizes, and loading states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'` (default: `'primary'`)
- `size?: 'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled?: boolean` (default: `false`)
- `loading?: boolean` (default: `false`)
- `icon?: string | null` - IconPark icon name or inline SVG
- `iconPosition?: 'left' | 'right'` (default: `'left'`)
- `type?: 'button' | 'submit' | 'reset'` (default: `'button'`)
- `onclick?: (event: MouseEvent) => void`

**Styling:**
- Background/border uses `--color-primary`, `--color-secondary`, `--color-accent`
- Border radius: `var(--radius-field)` (flat, 0rem)
- Hover effect: brightness filter
- Loading state shows spinning icon

**Example:**
```svelte
<script>
  import Button from '$lib/components/ui/formComponents/Button.svelte';
</script>

<!-- Primary button with icon -->
<Button variant="primary" icon="Copy" onclick={() => alert('Copied!')}>
  Copy to Clipboard
</Button>

<!-- Loading button -->
<Button variant="secondary" loading={true}>
  Processing...
</Button>

<!-- Outline button with right icon -->
<Button variant="outline" icon="Send" iconPosition="right">
  Send Message
</Button>

<!-- Small ghost button -->
<Button variant="ghost" size="sm">
  Cancel
</Button>
```

---

### 2. Input
A text input field with label, error states, and icon support.

**Props:**
- `label?: string`
- `placeholder?: string`
- `value?: string` (bindable)
- `type?: string` (default: `'text'`)
- `disabled?: boolean` (default: `false`)
- `error?: string` - Error message to display
- `leftIcon?: string | null` - IconPark icon name or SVG
- `rightIcon?: string | null` - IconPark icon name or SVG
- `id?: string` - Auto-generated if not provided
- `name?: string`
- Event handlers: `oninput`, `onchange`, `onfocus`, `onblur`

**Styling:**
- Background: `var(--color-base-200)`
- Text: `var(--color-base-content)`
- Border: `var(--color-base-300)` (error: `--color-error`)
- Border radius: `var(--radius-field)` (flat, 0rem)
- Focus ring: `--color-accent`

**Example:**
```svelte
<script>
  import Input from '$lib/components/ui/formComponents/Input.svelte';
  
  let username = $state('');
  let email = $state('');
  let errorMsg = $state('');
</script>

<!-- Basic input with label -->
<Input 
  label="Username" 
  placeholder="Enter your username" 
  bind:value={username}
/>

<!-- Input with left icon -->
<Input 
  label="Email" 
  placeholder="you@example.com" 
  leftIcon="Mail"
  bind:value={email}
/>

<!-- Input with error -->
<Input 
  label="Phone" 
  placeholder="+1 (555) 000-0000" 
  error={errorMsg}
  bind:value={phone}
/>

<!-- Disabled input -->
<Input 
  label="ID" 
  value="AUTO-12345" 
  disabled={true}
/>
```

---

### 3. PasswordField
A password input with toggle visibility functionality.

**Props:**
- `label?: string`
- `placeholder?: string`
- `value?: string` (bindable)
- `disabled?: boolean` (default: `false`)
- `error?: string`
- `id?: string`
- `name?: string`
- Event handlers: `oninput`, `onchange`, `onfocus`, `onblur`

**Features:**
- Eye/PreviewClose icons toggle password visibility
- Smooth fade transition between icons
- Same styling as Input component
- Border radius: `var(--radius-field)`

**Example:**
```svelte
<script>
  import PasswordField from '$lib/components/ui/formComponents/PasswordField.svelte';
  
  let password = $state('');
  let confirmPassword = $state('');
</script>

<!-- Basic password field -->
<PasswordField 
  label="Password" 
  placeholder="••••••••" 
  bind:value={password}
/>

<!-- Password with error -->
<PasswordField 
  label="Confirm Password" 
  placeholder="••••••••" 
  error={confirmPassword !== password ? 'Passwords do not match' : ''}
  bind:value={confirmPassword}
/>
```

---

### 4. Checkbox
A custom-styled checkbox with label and keyboard support.

**Props:**
- `checked?: boolean` (bindable, default: `false`)
- `label?: string`
- `disabled?: boolean` (default: `false`)
- `id?: string`
- `name?: string`
- `onchange?: (event: Event) => void`

**Styling:**
- Unchecked: background `--color-base-200`, border `--color-base-300`
- Checked: background `--color-accent`, border `--color-accent`
- Check icon: `--color-accent-content`
- Border radius: `var(--radius-box)` (flat, 0rem)

**Keyboard:**
- `Space` or `Enter` toggles checkbox

**Example:**
```svelte
<script>
  import Checkbox from '$lib/components/ui/formComponents/Checkbox.svelte';
  
  let agree = $state(false);
  let newsletter = $state(true);
</script>

<!-- Basic checkbox -->
<Checkbox 
  bind:checked={agree} 
  label="I agree to the terms and conditions"
/>

<!-- Pre-checked checkbox -->
<Checkbox 
  bind:checked={newsletter} 
  label="Subscribe to newsletter"
/>

<!-- Disabled checkbox -->
<Checkbox 
  checked={true} 
  label="Required (cannot change)" 
  disabled={true}
/>
```

---

### 5. Select
A custom dropdown select component with keyboard navigation.

**Props:**
- `label?: string`
- `options?: { label: string; value: string }[]` (default: `[]`)
- `value?: string` (bindable)
- `disabled?: boolean` (default: `false`)
- `placeholder?: string` (default: `'Select an option'`)
- `id?: string`
- `name?: string`
- `onchange?: (event: Event) => void`

**Styling:**
- Background: `--color-base-200`
- Dropdown: `--color-base-100`
- Border: `--color-base-300`
- Border radius: `var(--radius-selector)` (1rem, rounded)
- Padding: `var(--size-selector)`
- Selected option: `--color-base-200` background

**Features:**
- Down icon from IconPark
- Close icon to clear selection
- Smooth slide animation
- Click outside to close
- Custom scrollbar styling

**Keyboard:**
- `Enter` / `Space` - Toggle dropdown
- `ArrowDown` / `ArrowUp` - Navigate options
- `Escape` - Close dropdown

**Example:**
```svelte
<script>
  import Select from '$lib/components/ui/formComponents/Select.svelte';
  
  let country = $state('');
  let language = $state('en');
  
  const countries = [
    { label: 'United States', value: 'us' },
    { label: 'India', value: 'in' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' }
  ];
  
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' }
  ];
</script>

<!-- Basic select -->
<Select 
  label="Country" 
  options={countries}
  bind:value={country}
/>

<!-- Select with pre-selected value -->
<Select 
  label="Language" 
  options={languages}
  bind:value={language}
  placeholder="Choose a language"
/>

<!-- Disabled select -->
<Select 
  label="Region" 
  options={[]}
  disabled={true}
/>
```

---

### 6. Switch
A toggle switch component with smooth animation.

**Props:**
- `checked?: boolean` (bindable, default: `false`)
- `disabled?: boolean` (default: `false`)
- `label?: string`
- `id?: string`
- `name?: string`
- `onchange?: (event: Event) => void`

**Styling:**
- Track (off): `--color-base-300`
- Track (on): `--color-accent`
- Thumb: `--color-base-content`
- Border radius: `var(--radius-selector)` (1rem, rounded - this is the only curvy component)
- Smooth 200ms transition

**Keyboard:**
- `Space` or `Enter` toggles switch

**Example:**
```svelte
<script>
  import Switch from '$lib/components/ui/formComponents/Switch.svelte';
  
  let darkMode = $state(false);
  let notifications = $state(true);
</script>

<!-- Basic switch -->
<Switch 
  bind:checked={darkMode} 
  label="Enable dark mode"
/>

<!-- Pre-checked switch -->
<Switch 
  bind:checked={notifications} 
  label="Enable notifications"
/>

<!-- Disabled switch -->
<Switch 
  checked={true} 
  label="Always enabled" 
  disabled={true}
/>
```

---

### 7. ThemeSwitcher
A specialized theme toggle switch with animated Sun/Moon icons inside the thumb.

**Props:**
- `label?: string`
- `id?: string`
- `onchange?: (isDark: boolean) => void` - Callback with current theme state

**Features:**
- Automatically detects and toggles between dark/light themes
- SunOne icon for light theme (yellow background)
- Moon icon for dark theme (accent background)
- Icons are displayed inside the switch thumb
- Smooth 300ms transition animation
- Applies/removes `light-theme` class on `<html>` element
- Rounded edges: `var(--radius-selector)` (1rem)
- Larger size (3.5rem × 1.75rem) for better icon visibility

**Styling:**
- Track (dark): `var(--color-accent)`
- Track (light): `var(--color-warning)`
- Thumb: `var(--color-base-content)`
- Icons change color to match theme

**Keyboard:**
- `Space` or `Enter` toggles theme

**Example:**
```svelte
<script>
  import ThemeSwitcher from '$lib/components/ui/formComponents/ThemeSwitcher.svelte';
  
  function handleThemeChange(isDark: boolean) {
    console.log('Theme is now:', isDark ? 'dark' : 'light');
  }
</script>

<!-- Basic theme switcher -->
<ThemeSwitcher label="Toggle Theme" />

<!-- Without label -->
<ThemeSwitcher />

<!-- With change callback -->
<ThemeSwitcher 
  label="Theme" 
  onchange={handleThemeChange}
/>
```

**How it works:**
- The component checks for `.light-theme` class on page load
- When toggled, it adds/removes the `.light-theme` class from `<html>`
- Your app.css automatically applies the correct theme variables
- Icons animate smoothly during the transition

---

## Icon Usage

All components support icons from **IconPark SVG**. Icons can be passed as:

### 1. Icon Name (String)
```svelte
<Button icon="Copy">Copy</Button>
<Input leftIcon="Mail" />
```

### 2. Inline SVG String
```svelte
<Button icon="<svg>...</svg>">Custom Icon</Button>
```

### Common IconPark Icons
- `Copy`, `Check`, `Close`, `Down`, `Up`
- `Eye`, `PreviewClose` (for password fields)
- `Mail`, `User`, `Lock`, `Search`
- `Send`, `Edit`, `Delete`, `Plus`
- `Loading` (auto-used for loading state)

---

## Theme Variables

All components derive their styling from `app.css`:

### Colors
```css
--color-base-100        /* Darkest/Lightest background */
--color-base-200        /* Input backgrounds */
--color-base-300        /* Borders */
--color-base-content    /* Text color */

--color-primary         /* Primary buttons */
--color-primary-content /* Primary text */
--color-secondary       /* Secondary buttons */
--color-secondary-content
--color-accent          /* Accent buttons, focus rings, switches */
--color-accent-content

--color-error           /* Error text and borders */
--color-error-content
```

### Spacing & Sizing
```css
--radius-selector       /* 1rem (rounded - Select, Switch) */
--radius-field          /* 0rem (flat - Input, Button) */
--radius-box            /* 0rem (flat - Checkbox) */

--size-selector         /* 0.25rem padding */
--size-field            /* 0.25rem padding */

--border                /* 1px border width */
```

### Design Philosophy
- **Flat, non-curvy design** for most components (radius: 0rem)
- **Rounded edges** only for Select and Switch (radius: 1rem)
- **Theme-aware** - automatically adapts to dark/light themes
- **No hardcoded colors** - all colors from CSS variables

---

## Accessibility

All components are fully accessible:

✅ **Keyboard navigation** - Tab, Space, Enter, Arrow keys  
✅ **ARIA attributes** - `role`, `aria-checked`, `aria-disabled`, `aria-label`  
✅ **Label association** - Proper `for` + `id` linking  
✅ **Focus indicators** - Visible focus rings using `--color-accent`  
✅ **Screen reader support** - Semantic HTML and ARIA  
✅ **Disabled states** - Proper disabled attribute and visual feedback

---

## Complete Form Example

```svelte
<script lang="ts">
  import Button from '$lib/components/ui/formComponents/Button.svelte';
  import Input from '$lib/components/ui/formComponents/Input.svelte';
  import PasswordField from '$lib/components/ui/formComponents/PasswordField.svelte';
  import Checkbox from '$lib/components/ui/formComponents/Checkbox.svelte';
  import Select from '$lib/components/ui/formComponents/Select.svelte';
  import Switch from '$lib/components/ui/formComponents/Switch.svelte';
  import ThemeSwitcher from '$lib/components/ui/formComponents/ThemeSwitcher.svelte';

  let formData = $state({
    username: '',
    email: '',
    password: '',
    country: '',
    agree: false,
    newsletter: false
  });

  let loading = $state(false);
  let errors = $state<Record<string, string>>({});

  const countries = [
    { label: 'United States', value: 'us' },
    { label: 'India', value: 'in' },
    { label: 'United Kingdom', value: 'uk' }
  ];

  function validateForm() {
    errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.agree) errors.agree = 'You must agree to continue';
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    
    loading = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    loading = false;
    
    console.log('Form submitted:', formData);
  }
</script>

<form class="max-w-md mx-auto p-6 space-y-4">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold" style="color: var(--color-base-content);">
      Registration Form
    </h1>
    <ThemeSwitcher />
  </div>

  <Input
    label="Username"
    placeholder="Enter username"
    leftIcon="User"
    bind:value={formData.username}
    error={errors.username}
  />

  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    leftIcon="Mail"
    bind:value={formData.email}
    error={errors.email}
  />

  <PasswordField
    label="Password"
    placeholder="••••••••"
    bind:value={formData.password}
    error={errors.password}
  />

  <Select
    label="Country"
    options={countries}
    bind:value={formData.country}
    placeholder="Select your country"
  />

  <Checkbox
    bind:checked={formData.agree}
    label="I agree to the terms and conditions"
  />

  <Switch
    bind:checked={formData.newsletter}
    label="Subscribe to newsletter"
  />

  <div class="flex gap-3 pt-4">
    <Button
      type="submit"
      variant="primary"
      loading={loading}
      onclick={handleSubmit}
    >
      Submit
    </Button>
    
    <Button
      type="button"
      variant="outline"
      onclick={() => { formData = { username: '', email: '', password: '', country: '', agree: false, newsletter: false }; }}
    >
      Reset
    </Button>
  </div>
</form>
```

---

## Import Paths

```typescript
import Button from '$lib/components/ui/formComponents/Button.svelte';
import Input from '$lib/components/ui/formComponents/Input.svelte';
import PasswordField from '$lib/components/ui/formComponents/PasswordField.svelte';
import Checkbox from '$lib/components/ui/formComponents/Checkbox.svelte';
import Select from '$lib/components/ui/formComponents/Select.svelte';
import Switch from '$lib/components/ui/formComponents/Switch.svelte';
import ThemeSwitcher from '$lib/components/ui/formComponents/ThemeSwitcher.svelte';
```

---

## Notes

1. **No new theme files** - All styling uses existing `app.css` variables
2. **Svelte 5 runes** - Uses `$state`, `$derived`, `$bindable`, `$effect`
3. **Flat design** - Most components use `--radius-field` (0rem) for flat edges
4. **IconPark integration** - All icons use `@icon-park/svg` (already installed)
5. **TypeScript** - Full type safety with TypeScript props
6. **Production ready** - Fully tested, accessible, and performant
7. **Theme-aware** - Works seamlessly in both dark and light themes

---

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

---

## License

Part of the ElasticGaze project.
