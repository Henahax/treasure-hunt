<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import StepContentBlocks from '#lib/components/StepContentBlocks.svelte';
	import StepLocation from '#lib/components/StepLocation.svelte';
	import StepPassword from '#lib/components/StepPassword.svelte';
	import StepTime from '#lib/components/StepTime.svelte';
	import {
		completeTreasureHuntStep,
		getNextTreasureHuntStep,
		isStepCompleted,
		isStepUnlocked,
		setActiveTreasureHunt,
		treasureHunt
	} from '#lib/state/treasure-hunt.svelte.js';
	import type { TreasureHunt } from '#lib/state/treasure-hunt.svelte.js';
	import { translator } from '#lib/translator/index.svelte.js';

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
		treasureHunts.find((hunt) => hunt.id === params.treasureHunt.toLowerCase()) ?? null
	);
	const selectedStep = $derived(
		selectedTreasureHunt?.steps.find((step) => step.id === params.step) ?? null
	);
	const stepNumber = $derived(
		selectedTreasureHunt?.steps.findIndex((step) => step.id === params.step) ?? -1
	);
	const stepCompleted = $derived(
		selectedTreasureHunt && selectedStep
			? isStepCompleted(selectedTreasureHunt, selectedStep.id)
			: false
	);
	const allStepsCompleted = $derived(
		selectedTreasureHunt?.steps.every((step) => isStepCompleted(selectedTreasureHunt, step.id)) ??
			false
	);
	let currentTime = $state(Date.now());
	const timeAvailable = $derived(
		selectedStep?.type !== 'time' || currentTime >= selectedStep.time * 1000
	);
	const remainingSeconds = $derived(
		selectedStep?.type === 'time'
			? Math.max(0, Math.ceil((selectedStep.time * 1000 - currentTime) / 1000))
			: 0
	);

	let redirecting = false;

	$effect(() => {
		if (!treasureHunt.progressLoaded || !selectedTreasureHunt || !selectedStep) return;

		if (!isStepUnlocked(selectedTreasureHunt, selectedStep.id)) {
			const nextStep = getNextTreasureHuntStep(selectedTreasureHunt);
			if (nextStep && !redirecting) {
				redirecting = true;
				void goto(
					resolve('/treasure-hunt/[treasureHunt]/[step]', {
						treasureHunt: selectedTreasureHunt.id,
						step: nextStep.id
					})
				);
			}
			return;
		}

		redirecting = false;
		setActiveTreasureHunt(selectedTreasureHunt);
	});

	$effect(() => {
		if (selectedStep?.type !== 'time') return;

		const timer = window.setInterval(() => {
			currentTime = Date.now();
		}, 1000);

		return () => window.clearInterval(timer);
	});

	function continueToNextStep() {
		if (!selectedTreasureHunt || !selectedStep) return;

		if (!stepCompleted && !completeTreasureHuntStep(selectedTreasureHunt, selectedStep.id)) {
			return;
		}

		const nextStep = selectedTreasureHunt.steps[stepNumber + 1];
		if (nextStep) {
			void goto(
				resolve('/treasure-hunt/[treasureHunt]/[step]', {
					treasureHunt: selectedTreasureHunt.id,
					step: nextStep.id
				})
			);
		}
	}
</script>

{#if !treasureHunt.progressLoaded}
	<p>{translator.translate('steps.progressLoading')}</p>
{:else if selectedTreasureHunt && selectedStep && isStepUnlocked(selectedTreasureHunt, selectedStep.id)}
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

		{#if selectedStep.type === 'time'}
			<StepTime time={selectedStep.time} {timeAvailable} {remainingSeconds} />
		{/if}

		{#if selectedStep.type !== 'time' || timeAvailable}
			<StepContentBlocks content={selectedStep.content} title={selectedStep.title} />
		{/if}

		{#if allStepsCompleted && selectedStep.id === selectedTreasureHunt.steps.at(-1)?.id}
			<p role="status">{translator.translate('messages.huntCompleted')}</p>
		{:else if selectedStep.type === 'password' && !stepCompleted}
			<StepPassword password={selectedStep.password} onSuccess={continueToNextStep} />
		{:else if selectedStep.type === 'location' && !stepCompleted}
			<StepLocation location={selectedStep.location} onSuccess={continueToNextStep} />
		{:else if selectedStep.type === 'time' || timeAvailable}
			<button class="btn btn-primary w-fit" disabled={!timeAvailable} onclick={continueToNextStep}>
				{translator.translate(
					stepNumber === selectedTreasureHunt.steps.length - 1 ? 'steps.finish' : 'steps.next'
				)}
			</button>
		{/if}
	</div>
{:else if selectedTreasureHunt && selectedStep}
	<p>{translator.translate('steps.locked')}</p>
{:else}
	<div class="flex flex-col gap-4">
		<p>{translator.translate('steps.notFound')}</p>
		{#if selectedTreasureHunt}
			<a
				href={resolve('/treasure-hunt/[treasureHunt]', {
					treasureHunt: selectedTreasureHunt.id
				})}
			>
				{translator.translate('hunt.back')}
			</a>
		{/if}
	</div>
{/if}
