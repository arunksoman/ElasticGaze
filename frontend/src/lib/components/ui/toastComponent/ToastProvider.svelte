<script lang="ts">
	import { toastStore } from '$lib/components/ui/toastComponent/toastStore';
	import Toast from './toast.svelte';

	type Position =
		| 'top-right'
		| 'top-left'
		| 'top-center'
		| 'bottom-right'
		| 'bottom-left'
		| 'bottom-center';

	interface Props {
		position?: Position;
	}

	let { position = 'top-right' }: Props = $props();

	let toasts = $state<typeof $toastStore>([]);

	$effect(() => {
		const unsubscribe = toastStore.subscribe((value) => {
			toasts = value;
		});

		return () => unsubscribe();
	});

	let positionClasses = $derived.by(() => {
		const positionMap: Record<Position, string> = {
			'top-right': 'top-4 right-4',
			'top-left': 'top-4 left-4',
			'top-center': 'top-4 left-1/2 -translate-x-1/2',
			'bottom-right': 'bottom-4 right-4',
			'bottom-left': 'bottom-4 left-4',
			'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
		};
		return positionMap[position] || positionMap['top-right'];
	});
</script>

<div class="toast-provider fixed {positionClasses} z-50 pointer-events-none">
	<div class="flex flex-col gap-3">
		{#each toasts as toastItem (toastItem.id)}
			<div class="pointer-events-auto">
				<Toast
					id={toastItem.id}
					message={toastItem.message}
					type={toastItem.type}
					duration={toastItem.duration}
				/>
			</div>
		{/each}
	</div>
</div>
