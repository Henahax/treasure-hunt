<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { treasureHunt } from '$lib/state/treasure-hunt.svelte';
	import type { TreasureHunt } from '$lib/state/treasure-hunt.svelte';

	import type { PageProps } from './$types';
	let { params }: PageProps = $props();
	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, hunt]) => hunt);
	const selectedTreasureHunt = $derived(
		treasureHunts.find((hunt) => hunt.id === params.treasureHunt) ?? null
	);
	const firstStep = $derived(selectedTreasureHunt?.steps[0] ?? null);

	async function startTreasureHunt() {
		if (!selectedTreasureHunt || !firstStep) return;

		treasureHunt.active = selectedTreasureHunt;
		await goto(
			resolve('/treasure-hunt/[treasureHunt]/[step]', {
				treasureHunt: selectedTreasureHunt.id,
				step: firstStep.id
			})
		);
	}
</script>

<button onclick={startTreasureHunt} disabled={!selectedTreasureHunt || !firstStep}>
	{treasureHunt.active?.id === selectedTreasureHunt?.id ? 'Jagd fortsetzen' : 'Jagd starten'}
</button>
