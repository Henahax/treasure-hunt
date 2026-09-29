<script lang="ts">
	import { resolve } from '$app/paths';
	import Continue from '$lib/components/Continue.svelte';

	type TreasureHunt = {
		id: string;
		name: string;
		description: string;
		steps: unknown[];
	};

	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, treasureHunt]) => treasureHunt);
</script>

<div>Browser</div>

<Continue />

<div class="grid grid-cols-[1fr_auto] divide-y rounded-md border">
	{#each treasureHunts as treasureHunt}
		<a
			href={resolve('/treasure-hunt/[treasureHunt]', { treasureHunt: treasureHunt.id })}
			class="col-span-full grid grid-cols-subgrid p-2"
		>
			<div>{treasureHunt.name}</div>
			<div class="text-xs">{treasureHunt.steps.length} Schritte</div>
			<div class="col-span-full text-sm">
				{treasureHunt.description}
			</div>
		</a>
	{/each}
</div>
