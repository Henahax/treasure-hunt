<script lang="ts">
	import { treasureHunt } from '#lib/state/treasure-hunt.svelte.js';
	import { translator } from '#lib/translator/index.svelte.js';

	import TreasureHuntActiveContinue from '#lib/components/TreasureHuntActiveContinue.svelte';
	import TreasureHuntActiveReset from '#lib/components/TreasureHuntActiveReset.svelte';
</script>

{#if treasureHunt.active}
	<label class="flex flex-col gap-2">
		<span class="text-xs opacity-75">
			{translator.translate('hunt.active')}
		</span>
		<div class="flex gap-2">
			<TreasureHuntActiveContinue />
			<TreasureHuntActiveReset hunt={treasureHunt.active} />
		</div>
	</label>
{/if}
