<script lang="ts">
	import * as IconPark from '@icon-park/svg';
	
	type AlertType = 'info' | 'success' | 'warning' | 'error';
	
	interface Props {
		type?: AlertType;
		title?: string;
		message?: string;
		icon?: string;
		dismissible?: boolean;
		onDismiss?: () => void;
		class?: string;
		children?: import('svelte').Snippet;
		actions?: import('svelte').Snippet;
		'custom-icon'?: import('svelte').Snippet;
	}
	
	let {
		type = 'info',
		title,
		message,
		icon,
		dismissible = false,
		onDismiss,
		class: className = '',
		children,
		actions,
		'custom-icon': customIcon
	}: Props = $props();
	
	let dismissed = $state(false);
	
	const typeStyles = $derived.by(() => {
		const styles: Record<AlertType, { bg: string; border: string; text: string; defaultIcon: string }> = {
			info: {
				bg: 'bg-info/10',
				border: 'border-info',
				text: 'text-info',
				defaultIcon: 'Info'
			},
			success: {
				bg: 'bg-success/10',
				border: 'border-success',
				text: 'text-success',
				defaultIcon: 'CheckOne'
			},
			warning: {
				bg: 'bg-warning/10',
				border: 'border-warning',
				text: 'text-warning',
				defaultIcon: 'Attention'
			},
			error: {
				bg: 'bg-error/10',
				border: 'border-error',
				text: 'text-error',
				defaultIcon: 'CloseOne'
			}
		};
		return styles[type];
	});
	
	const iconName = $derived(icon || typeStyles.defaultIcon);
	
	const iconHtml = $derived.by(() => {
		const IconComponent = (IconPark as any)[iconName];
		if (typeof IconComponent === 'function') {
			return IconComponent({ theme: 'outline', size: '24', strokeWidth: 3 });
		}
		return '';
	});
	
	function handleDismiss() {
		dismissed = true;
		onDismiss?.();
	}
</script>

{#if !dismissed}
	<div 
		class="border-l-4 px-6 py-4 mb-6 mt-4 rounded-r-lg shadow-lg {typeStyles.bg} {typeStyles.border} {className}"
		role="alert"
	>
		<div class="flex items-start gap-4">
			{#if customIcon}
				<div class="shrink-0 mt-0.5 {typeStyles.text}">
					{@render customIcon()}
				</div>
			{:else if iconHtml}
				<div class="shrink-0 mt-0.5 {typeStyles.text}">
					{@html iconHtml}
				</div>
			{/if}
			
			<div class="flex-1">
				{#if title}
					<h3 class="text-lg font-semibold text-(--color-base-content) mb-1">
						{title}
					</h3>
				{/if}
				
				{#if message}
					<p class="text-(--color-base-content) opacity-80 mb-3">
						{message}
					</p>
				{/if}
				
				{#if children}
					<div class="text-(--color-base-content) opacity-80 mb-3">
						{@render children()}
					</div>
				{/if}
				
				{#if actions}
					<div class="mt-3">
						{@render actions()}
					</div>
				{/if}
			</div>
			
			{#if dismissible}
				<button
					onclick={handleDismiss}
					class="shrink-0 p-1 rounded hover:bg-base-300 transition-colors {typeStyles.text}"
					type="button"
					aria-label="Dismiss alert"
				>
					{@html IconPark.Close({ theme: 'outline', size: '20', strokeWidth: 3 })}
				</button>
			{/if}
		</div>
	</div>
{/if}
