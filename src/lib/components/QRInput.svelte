<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import QRScanner from '$lib/components/QRScanner.svelte';

	let {
		value = $bindable(''),
		inputLabel,
		placeholder,
		submitLabel,
		required = false
	}: {
		value?: string;
		inputLabel?: string;
		placeholder?: string;
		submitLabel?: string;
		required?: boolean;
	} = $props();
	let isScanning = $state(false);
</script>

<div class="flex">
	<button
		type="button"
		class="qr-input-scan btn btn-neutral"
		aria-label={translator.translate('scanner.title')}
		onclick={() => (isScanning = true)}
	>
		<i class="fa-solid fa-qrcode"></i>
		<span class="max-md:hidden">{translator.translate('form.scan')}</span>
	</button>

	<input
		bind:value
		type="text"
		aria-label={inputLabel ?? translator.translate('form.codeLabel')}
		placeholder={placeholder ?? translator.translate('form.codePlaceholder')}
		{required}
		class="w-full"
	/>

	<button
		type="submit"
		class="qr-input-submit btn btn-primary"
		aria-label={submitLabel ?? translator.translate('form.submit')}
	>
		<i class="fa-solid fa-key"></i>
		<span>{submitLabel ?? translator.translate('form.submit')}</span>
	</button>
</div>

{#if isScanning}
	<QRScanner
		onresult={(scannedCode) => {
			value = scannedCode;
			isScanning = false;
		}}
		onclose={() => (isScanning = false)}
	/>
{/if}

<style>
	button.qr-input-scan {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	input {
		border-radius: 0;
	}

	button.qr-input-submit {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
</style>
