<script lang="ts">
	import { translator } from '#lib/translator/index.svelte.js';
	import {
		isStepCompleted,
		resetTreasureHuntProgress,
		treasureHunt
	} from '#lib/state/treasure-hunt.svelte.js';

	const hasProgress = $derived(
		treasureHunt.active?.steps.some((step) => isStepCompleted(treasureHunt.active!, step.id)) ??
			false
	);

	function resetActiveTreasureHunt() {
		const activeHunt = treasureHunt.active;
		if (
			!activeHunt ||
			!window.confirm(translator.translate('hunt.resetConfirm', { name: activeHunt.name }))
		) {
			return;
		}

		resetTreasureHuntProgress(activeHunt);
	}
</script>

{#if treasureHunt.active && hasProgress}
	<button
		class="btn btn-neutral w-fit"
		onclick={resetActiveTreasureHunt}
		title={translator.translate('hunt.reset')}
	>
		<i class="fa-solid fa-rotate-left"></i>
		<span class="max-sm:hidden">{translator.translate('hunt.reset')}</span>
	</button>
{/if}
