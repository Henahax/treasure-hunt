<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import { resolve } from '$app/paths';

	import Continue from '$lib/components/Continue.svelte';
	import QRInput from '$lib/components/QRInput.svelte';
</script>

<div class="flex flex-col gap-4">
	<Continue />

	<div class="flex gap-4">
		<input class="grow" type="text" placeholder={translator.translate('form.enter-code')} />
		<button class="btn btn-primary">{translator.translate('form.submit')}</button>
	</div>
	<a href={resolve('/treasure-hunts')} class="btn btn-neutral">
		<i class="fa-regular fa-compass"></i>
		<span>{translator.translate('form.browse-treasure-hunts')}</span>
	</a>

	<QRInput />
</div>
