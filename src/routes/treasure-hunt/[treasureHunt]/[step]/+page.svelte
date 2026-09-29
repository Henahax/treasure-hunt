<script lang="ts">
	import { resolve } from '$app/paths';
	import { marked } from 'marked';
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
	const selectedStep = $derived(
		selectedTreasureHunt?.steps.find((step) => step.id === params.step) ?? null
	);
	const stepNumber = $derived(
		selectedTreasureHunt?.steps.findIndex((step) => step.id === params.step) ?? -1
	);
</script>

{#if selectedTreasureHunt && selectedStep}
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between gap-4 text-sm">
			<a
				href={resolve('/treasure-hunt/[treasureHunt]', {
					treasureHunt: selectedTreasureHunt.id
				})}
			>
				{selectedTreasureHunt.name}
			</a>
			<span>{stepNumber + 1} / {selectedTreasureHunt.steps.length}</span>
		</div>

		<h1 class="text-2xl font-bold">{selectedStep.title}</h1>

		{#each selectedStep.content as content}
			{#if content.type === 'text' && content.text}
				<div class="prose max-w-none prose-invert">
					{@html marked.parse(content.text)}
				</div>
			{:else if content.type === 'link' && content.url}
				<a href={content.url} target="_blank" rel="noreferrer" class="btn btn-neutral w-fit">
					<i class="fa-solid fa-arrow-up-right-from-square"></i>
					<span>Link öffnen</span>
				</a>
			{:else if content.type === 'image' && content.url}
				<img
					src={content.url}
					alt={selectedStep.title}
					class="h-auto max-h-112 w-full rounded-md object-cover"
				/>
			{/if}
		{/each}
	</div>
{:else}
	<div class="flex flex-col gap-4">
		<p>Der Step wurde nicht gefunden.</p>
		{#if selectedTreasureHunt}
			<a
				href={resolve('/treasure-hunt/[treasureHunt]', {
					treasureHunt: selectedTreasureHunt.id
				})}
			>
				Zur Jagd
			</a>
		{/if}
	</div>
{/if}
