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
		confirmPassword: '',
		country: '',
		language: 'en',
		agree: false,
		newsletter: true,
		darkMode: false
	});

	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	const countries = [
		{ label: 'United States', value: 'us' },
		{ label: 'India', value: 'in' },
		{ label: 'United Kingdom', value: 'uk' },
		{ label: 'Canada', value: 'ca' },
		{ label: 'Australia', value: 'au' },
		{ label: 'Germany', value: 'de' },
		{ label: 'France', value: 'fr' }
	];

	const languages = [
		{ label: 'English', value: 'en' },
		{ label: 'Spanish', value: 'es' },
		{ label: 'French', value: 'fr' },
		{ label: 'German', value: 'de' }
	];

	function validateForm() {
		errors = {};
		if (!formData.username) errors.username = 'Username is required';
		if (!formData.email) errors.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
		if (!formData.password) errors.password = 'Password is required';
		else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
		if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
		if (!formData.agree) errors.agree = 'You must agree to the terms';
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validateForm()) return;

		loading = true;
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		loading = false;

		console.log('Form submitted:', formData);
		alert('Form submitted successfully! Check console for data.');
	}

	function resetForm() {
		formData = {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			country: '',
			language: 'en',
			agree: false,
			newsletter: true,
			darkMode: false
		};
		errors = {};
	}
</script>

<div class="p-8 max-w-6xl mx-auto">
	<div class="flex items-center justify-between mb-2">
		<h1 class="text-3xl font-bold" style="color: var(--color-base-content);">
			Form Components Demo
		</h1>
		<ThemeSwitcher label="Theme" />
	</div>
	<p class="mb-8 text-sm" style="color: var(--color-base-content); opacity: 0.7;">
		Themeable form components built with Svelte 5 using app.css variables
	</p>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Form Demo -->
		<div>
			<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
				Registration Form
			</h2>

			<form class="space-y-4" onsubmit={handleSubmit}>
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

				<PasswordField
					label="Confirm Password"
					placeholder="••••••••"
					bind:value={formData.confirmPassword}
					error={errors.confirmPassword}
				/>

				<Select
					label="Country"
					options={countries}
					bind:value={formData.country}
					placeholder="Select your country"
				/>

				<Select
					label="Preferred Language"
					options={languages}
					bind:value={formData.language}
				/>

				<Checkbox bind:checked={formData.agree} label="I agree to the terms and conditions" />

				<Switch bind:checked={formData.newsletter} label="Subscribe to newsletter" />

				<Switch bind:checked={formData.darkMode} label="Enable dark mode" />

				<div class="flex gap-3 pt-4">
					<Button type="submit" variant="primary" loading={loading} icon="Check">
						Submit Form
					</Button>

					<Button type="button" variant="outline" onclick={resetForm} icon="Close">
						Reset
					</Button>
				</div>
			</form>
		</div>

		<!-- Component Showcase -->
		<div class="space-y-8">
			<div>
				<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
					Button Variants
				</h2>
				<div class="flex flex-wrap gap-2 mb-3">
					<Button variant="primary" size="sm">Primary</Button>
					<Button variant="secondary" size="sm">Secondary</Button>
					<Button variant="accent" size="sm">Accent</Button>
					<Button variant="outline" size="sm">Outline</Button>
					<Button variant="ghost" size="sm">Ghost</Button>
				</div>
				<div class="flex flex-wrap gap-2 mb-3">
					<Button variant="primary">Medium (default)</Button>
					<Button variant="secondary">Medium</Button>
				</div>
				<div class="flex flex-wrap gap-2 mb-3">
					<Button variant="primary" size="lg">Large</Button>
					<Button variant="accent" size="lg">Large</Button>
				</div>
			</div>

			<div>
				<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
					Button with Icons
				</h2>
				<div class="flex flex-wrap gap-2 mb-3">
					<Button variant="primary" icon="Copy">Copy</Button>
					<Button variant="secondary" icon="Check">Save</Button>
					<Button variant="accent" icon="Send" iconPosition="right">Send</Button>
					<Button variant="outline" icon="Edit">Edit</Button>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button variant="primary" loading={true}>Loading...</Button>
					<Button variant="secondary" disabled={true}>Disabled</Button>
				</div>
			</div>

			<div>
				<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
					Input Variations
				</h2>
				<div class="space-y-3">
					<Input label="Basic Input" placeholder="Enter text" />
					<Input label="With Left Icon" placeholder="Search..." leftIcon="Search" />
					<Input label="With Right Icon" placeholder="Enter email" rightIcon="Mail" />
					<Input label="Disabled" value="Cannot edit" disabled={true} />
					<Input label="With Error" error="This field is required" />
				</div>
			</div>

			<div>
				<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
					Checkboxes & Switches
				</h2>
				<div class="space-y-3">
					<Checkbox checked={true} label="Checked checkbox" />
					<Checkbox checked={false} label="Unchecked checkbox" />
					<Checkbox checked={true} disabled={true} label="Disabled checkbox" />
					<Switch checked={true} label="Enabled switch" />
					<Switch checked={false} label="Disabled switch (off)" />
					<Switch checked={true} disabled={true} label="Disabled switch (on)" />
				</div>
			</div>

			<div>
				<h2 class="text-xl font-semibold mb-4" style="color: var(--color-base-content);">
					Theme Switcher
				</h2>
				<div class="space-y-3">
					<ThemeSwitcher label="Toggle Dark/Light Theme" />
					<ThemeSwitcher />
					<p class="text-xs mt-2" style="color: var(--color-base-content); opacity: 0.7;">
						Click the switch above to toggle between dark and light themes. 
						The icon changes from Moon (dark) to Sun (light).
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="mt-12 p-6 rounded-lg" style="background-color: var(--color-base-100);">
		<h2 class="text-xl font-semibold mb-3" style="color: var(--color-base-content);">
			✨ Features
		</h2>
		<ul class="space-y-2 text-sm" style="color: var(--color-base-content);">
			<li>✓ <strong>Themed</strong> - Uses app.css CSS variables for consistent styling</li>
			<li>✓ <strong>Svelte 5 Runes</strong> - Modern reactive syntax with $state, $derived, $bindable</li>
			<li>✓ <strong>TypeScript</strong> - Full type definitions and type safety</li>
			<li>✓ <strong>Accessible</strong> - WCAG compliant with ARIA attributes</li>
			<li>✓ <strong>Keyboard Navigation</strong> - Full keyboard support (Tab, Space, Enter, Arrows)</li>
			<li>✓ <strong>Icon Support</strong> - IconPark SVG icons integrated</li>
			<li>✓ <strong>Flat Design</strong> - Uses --radius-field (0rem) for most components</li>
			<li>✓ <strong>Responsive</strong> - Works on all screen sizes</li>
			<li>✓ <strong>Production Ready</strong> - Battle-tested patterns</li>
		</ul>
	</div>

	<!-- Theme Info -->
	<div class="mt-6 p-6 rounded-lg" style="background-color: var(--color-base-200);">
		<h2 class="text-xl font-semibold mb-3" style="color: var(--color-base-content);">
			🎨 Theme Variables
		</h2>
		<p class="text-sm mb-4" style="color: var(--color-base-content);">
			All components use CSS variables from app.css:
		</p>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
			<div class="p-2 rounded" style="background-color: var(--color-primary);">
				<span style="color: var(--color-primary-content);">--color-primary</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-secondary);">
				<span style="color: var(--color-secondary-content);">--color-secondary</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-accent);">
				<span style="color: var(--color-accent-content);">--color-accent</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-error);">
				<span style="color: var(--color-error-content);">--color-error</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-success);">
				<span style="color: var(--color-success-content);">--color-success</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-warning);">
				<span style="color: var(--color-warning-content);">--color-warning</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-info);">
				<span style="color: var(--color-info-content);">--color-info</span>
			</div>
			<div class="p-2 rounded" style="background-color: var(--color-base-300);">
				<span style="color: var(--color-base-content);">--color-base-300</span>
			</div>
		</div>
	</div>
</div>
