<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		getNextTreasureHuntStep,
		isStepCompleted,
		setActiveTreasureHunt,
		treasureHunt
	} from '$lib/state/treasure-hunt.svelte';
	import ResetActiveTreasureHunt from '$lib/components/TreasureHuntActiveReset.svelte';
	import type { TreasureHunt } from '$lib/state/treasure-hunt.svelte';
	import { translator } from '$lib/translator/index.svelte';

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
	const hasProgress = $derived(
		selectedTreasureHunt?.steps.some((step) => isStepCompleted(selectedTreasureHunt, step.id)) ??
			false
	);

	async function startTreasureHunt() {
		if (!selectedTreasureHunt) return;

		const nextStep = getNextTreasureHuntStep(selectedTreasureHunt) ?? firstStep;
		if (!nextStep) return;

		setActiveTreasureHunt(selectedTreasureHunt);
		await goto(
			resolve('/treasure-hunt/[treasureHunt]/[step]', {
				treasureHunt: selectedTreasureHunt.id,
				step: nextStep.id
			})
		);
	}
</script>

{#if selectedTreasureHunt}
	<div class="flex flex-col gap-5">
		{#if selectedTreasureHunt.picture}
			<img
				src={selectedTreasureHunt.picture}
				alt={selectedTreasureHunt.name}
				class="aspect-3/2 w-full rounded-md object-cover"
				fetchpriority="high"
			/>
		{/if}

		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold">{selectedTreasureHunt.name}</h1>
			<p class="text-secondary leading-relaxed">{selectedTreasureHunt.description}</p>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<button class="btn btn-primary w-fit" onclick={startTreasureHunt} disabled={!firstStep}>
				<i class="fa-solid fa-play" aria-hidden="true"></i>
				<span>
					{translator.translate(
						treasureHunt.active?.id === selectedTreasureHunt.id || hasProgress
							? 'hunt.continue'
							: 'hunt.start'
					)}
				</span>
			</button>
			<ResetActiveTreasureHunt />
		</div>
	</div>
{:else}
	<p>{translator.translate('hunt.notFound')}</p>
{/if}
