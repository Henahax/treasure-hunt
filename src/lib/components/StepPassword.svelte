<script lang="ts">
	import QRInput from '#lib/components/QRInput.svelte';
	import { translator } from '#lib/translator/index.svelte.js';

	let { password, onSuccess }: { password: string; onSuccess: () => void } = $props();
	let passwordInput = $state('');
	let stepMessage = $state('');

	function submitPassword(event: SubmitEvent) {
		event.preventDefault();

		if (passwordInput.trim() !== password) {
			stepMessage = translator.translate('messages.passwordIncorrect');
			return;
		}

		stepMessage = '';
		passwordInput = '';
		onSuccess();
	}
</script>

<form class="flex flex-wrap items-end gap-2" onsubmit={submitPassword}>
	<QRInput
		bind:value={passwordInput}
		inputLabel={translator.translate('form.passwordCode')}
		placeholder={translator.translate('form.passwordCode')}
		submitLabel={translator.translate('form.verifyPassword')}
		required
	/>
</form>

{#if stepMessage}
	<p role="status">{stepMessage}</p>
{/if}
