<script lang="ts">
	import { goto } from '$app/navigation';
	import { translator } from '#lib/translator/index.svelte.js';
	import { resolve } from '$app/paths';
	import { setActiveTreasureHunt, type TreasureHunt } from '#lib/state/treasure-hunt.svelte.js';
	import shareImage from '#lib/assets/share.png';

	import QRInput from '#lib/components/QRInput.svelte';

	import TreasureHuntActive from '#lib/components/TreasureHuntActive.svelte';

	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, hunt]) => hunt);

	let huntCode = $state('');
	let codeError = $state('');

	async function submitHuntCode(event: SubmitEvent) {
		event.preventDefault();

		const code = huntCode.trim().toLowerCase();
		const hunt = treasureHunts.find((candidate) => candidate.id === code);

		if (!hunt) {
			codeError = translator.translate('messages.huntCodeNotFound');
			return;
		}

		codeError = '';
		setActiveTreasureHunt(hunt);
		await goto(resolve('/treasure-hunt/[treasureHunt]', { treasureHunt: hunt.id }));
	}
</script>

<div class="flex flex-col gap-6">
	<h1 class="text-4xl font-bold">{translator.translate('app.title')}</h1>

	<TreasureHuntActive />

	<form class="flex flex-col gap-2" onsubmit={submitHuntCode}>
		<span class="text-xs opacity-75">{translator.translate('form.codeLabel')}</span>
		<QRInput bind:value={huntCode} required />
		{#if codeError}<p class="text-error" role="status">{codeError}</p>{/if}
	</form>

	<a href={resolve('treasure-hunts')} class="btn btn-primary h-16 text-lg font-bold">
		<i class="fa-regular fa-compass"></i>
		<span>{translator.translate('nav.browse')}</span>
	</a>

	<div class="flex flex-col items-center gap-2">
		<div>share test:</div>
		<img src={shareImage} alt="Treasure Hunt 1" class="h-1/2 w-1/2 rounded-xl object-cover" />
	</div>
</div>
