<script lang="ts">
	import { resolve } from '$app/paths';
	import Continue from '$lib/components/Continue.svelte';

	let test = [
		{
			id: 1,
			name: 'Piraten im Ostpark',
			location: 'München',
			tags: ['tag1', 'tag2']
		},
		{
			id: 2,
			name: 'Finde den Hacker',
			location: 'Online',
			tags: ['tag1']
		},
		{
			id: 3,
			name: 'Mord von Ellen Kiel',
			location: 'Guild Wars 2',
			tags: ['tag1', 'tag2']
		}
	];
</script>

<div>Browser</div>

<Continue />

<div class="grid grid-cols-[1fr_auto] divide-y rounded-md border">
	{#each test as myTest}
		<a
			href={resolve('/treasure-hunt/[slug]', { slug: String(myTest.id) })}
			class="col-span-full grid grid-cols-subgrid p-2"
		>
			<div>{myTest.name}</div>
			<div class="flex items-center gap-1 text-xs">
				<i class="fa-solid fa-location-dot"></i>
				<span>{myTest.location}</span>
			</div>
			<div class="col-span-full flex items-center gap-1">
				{#each myTest.tags as tag}
					<span class="tag text-xs">{tag}</span>
				{/each}
			</div>
		</a>
	{/each}
</div>
