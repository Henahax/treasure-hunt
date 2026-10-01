<script lang="ts">
	import { resolve } from '$app/paths';
	import TreasureHuntActive from '#lib/components/TreasureHuntActive.svelte';
	import type { TreasureHunt } from '#lib/state/treasure-hunt.svelte.js';
	import { translator } from '#lib/translator/index.svelte.js';

	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, treasureHunt]) => treasureHunt)
		.filter((treasureHunt) => treasureHunt.public);
</script>

<TreasureHuntActive />

<h1 class="text-3xl font-bold">{translator.translate('catalog.title')}</h1>

<div class="grid grid-cols-[1fr_auto] divide-y rounded-md border">
	{#each treasureHunts as treasureHunt}
		<a
			href={resolve('/treasure-hunt/[treasureHunt]', { treasureHunt: treasureHunt.id })}
			class="col-span-full grid grid-cols-subgrid p-2"
		>
			<div>{treasureHunt.name}</div>
			<div class="text-xs">
				{translator.translate('catalog.stepsCount', { count: treasureHunt.steps.length })}
			</div>
			<div class="col-span-full text-sm">
				{treasureHunt.description}
			</div>
		</a>
	{/each}
</div>
