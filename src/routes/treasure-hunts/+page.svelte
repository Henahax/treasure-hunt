<script lang="ts">
	import { resolve } from '$app/paths';
	import TreasureHuntActive from '#lib/components/TreasureHuntActive.svelte';
	import { treasureHunts } from '#lib/treasure-hunt-catalog.js';
	import { translator } from '#lib/translator/index.svelte.js';
	const publicTreasureHunts = $derived(treasureHunts.filter((treasureHunt) => treasureHunt.public));
</script>

<TreasureHuntActive />

<h1 class="text-3xl font-bold">{translator.translate('catalog.title')}</h1>

<div class="grid grid-cols-[1fr_auto] divide-y rounded-md border">
	{#each publicTreasureHunts as treasureHunt (treasureHunt.id)}
		<a
			href={resolve('/treasure-hunt/[treasureHunt]', { treasureHunt: treasureHunt.id })}
			class="col-span-full grid grid-cols-subgrid p-2"
		>
			<div class="text-lg font-semibold">{treasureHunt.name}</div>
			<div class="text-xs">
				{translator.translate('catalog.stepsCount', { count: treasureHunt.steps.length })}
			</div>
			<div class="text-muted col-span-full text-sm">
				{treasureHunt.description}
			</div>
		</a>
	{/each}
</div>

<style>
	a:hover {
		background-color: var(--app-color-hover);
	}
</style>
