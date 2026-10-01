<script lang="ts">
	import { resolve } from '$app/paths';
	import { translator } from '#lib/translator/index.svelte.js';
	import { treasureHunt } from '#lib/state/treasure-hunt.svelte.js';
</script>

{#if treasureHunt.active}
	<div class="flex w-full flex-col gap-2">
		<a
			href={resolve('/treasure-hunt/[treasureHunt]', {
				treasureHunt: treasureHunt.active.id
			})}
			class="btn btn-primary w-full"
		>
			<div class="grid grid-cols-[auto_1fr] items-center justify-items-start gap-x-4 text-start">
				<i class="fa-solid fa-play row-span-2 text-2xl"></i>
				<span class="text-xs opacity-75">{translator.translate('nav.continue')}:</span>
				<div class="text-lg font-bold">{treasureHunt.active.name}</div>
			</div>
		</a>
	</div>
{/if}
