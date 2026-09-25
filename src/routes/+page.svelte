<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="flex w-fit flex-col gap-8">
	<button type="button" class="btn btn-primary">{translator.translate('form.continue')}</button>

	<div class="flex gap-4">
		<input type="text" placeholder={translator.translate('form.enter-code')} />
		<button class="btn btn-primary">{translator.translate('form.submit')}</button>
	</div>
	<a href={resolve('/treasure-hunts')} class="btn btn-neutral">
		{translator.translate('form.browse-treasure-hunts')}
	</a>
</div>
