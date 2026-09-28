<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import { treasureHunt } from '$lib/state/treasure-hunt.svelte';
</script>

{#if treasureHunt.id > 0}
	<div class="flex w-full flex-col gap-2">
		<div>Active Hunt: todo</div>
		<button type="button" class="btn btn-primary w-full">
			<div class="grid grid-cols-[auto_1fr] items-center justify-items-start gap-x-4 text-start">
				<i class="fa-solid fa-play row-span-2 text-2xl"></i>
				<span class="text-xs opacity-75">{translator.translate('form.continue')}:</span>
				<div class="text-lg font-bold">Schnitzeljagd: Testjagd 1234 mit ordentlich Schmackes</div>
			</div>
		</button>
	</div>
{/if}

<style>
</style>
