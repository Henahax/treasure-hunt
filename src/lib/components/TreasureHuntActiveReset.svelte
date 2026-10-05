<script lang="ts">
	import { translator } from '#lib/translator/index.svelte.js';
	import {
		isStepCompleted,
		resetTreasureHuntProgress,
		treasureHunt
	} from '#lib/state/treasure-hunt.svelte.js';
	import type { TreasureHunt } from '#lib/state/treasure-hunt.svelte.js';

	let { hunt }: { hunt: TreasureHunt } = $props();
	const hasProgress = $derived(hunt.steps.some((step) => isStepCompleted(hunt, step.id)));
	const canReset = $derived(hasProgress || treasureHunt.active?.id === hunt.id);

	function resetActiveTreasureHunt() {
		if (!window.confirm(translator.translate('hunt.resetConfirm', { name: hunt.name }))) {
			return;
		}

		resetTreasureHuntProgress(hunt);
	}
</script>

{#if canReset}
	<button
		class="btn btn-neutral w-fit"
		onclick={resetActiveTreasureHunt}
		title={translator.translate('hunt.reset')}
	>
		<i class="fa-solid fa-rotate-left"></i>
		<span class="max-sm:hidden">{translator.translate('hunt.reset')}</span>
	</button>
{/if}
