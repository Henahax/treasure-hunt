<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import { resolve } from '$app/paths';

	import QRInput from '$lib/components/QRInput.svelte';

	import TreasureHuntActive from '$lib/components/TreasureHuntActive.svelte';
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-4xl font-bold">Schnitzeljagd xx</h1>

	<TreasureHuntActive />

	<label class="flex flex-col gap-2">
		<span class="text-xs opacity-75">Test</span>
		<QRInput />
	</label>

	<a href={resolve('/treasure-hunts')} class="btn btn-primary h-16 text-lg font-bold">
		<i class="fa-regular fa-compass"></i>
		<span>{translator.translate('form.browse-treasure-hunts')}</span>
	</a>
</div>
