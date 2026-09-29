<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import {
		isStepCompleted,
		resetTreasureHuntProgress,
		treasureHunt
	} from '$lib/state/treasure-hunt.svelte';

	const hasProgress = $derived(
		treasureHunt.active?.steps.some((step) => isStepCompleted(treasureHunt.active!, step.id)) ??
			false
	);

	function resetActiveTreasureHunt() {
		const activeHunt = treasureHunt.active;
		if (!activeHunt || !window.confirm(`Fortschritt für "${activeHunt.name}" zurücksetzen?`)) {
			return;
		}

		resetTreasureHuntProgress(activeHunt);
	}
</script>

{#if treasureHunt.active && hasProgress}
	<button
		class="btn btn-neutral w-fit"
		onclick={resetActiveTreasureHunt}
		title={translator.translate('treasure-hunt.reset')}
	>
		<i class="fa-solid fa-rotate-left"></i>
		<span class="max-sm:hidden">{translator.translate('treasure-hunt.reset')}</span>
	</button>
{/if}
