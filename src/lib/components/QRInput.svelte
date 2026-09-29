<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import QRScanner from '$lib/components/QRScanner.svelte';

	let { value = $bindable('') }: { value?: string } = $props();
	let isScanning = $state(false);
</script>

<div class="flex">
	<button
		id="code-scan"
		class="btn btn-neutral"
		aria-label="QR-Code scannen"
		onclick={() => (isScanning = true)}
	>
		<i class="fa-solid fa-qrcode"></i>
		<span class="max-md:hidden">Scannen</span>
	</button>

	<input
		bind:value
		type="text"
		placeholder={translator.translate('form.enter-code')}
		class="w-full"
	/>

	<button id="code-submit" class="btn btn-primary" aria-label="QR-Code">
		<i class="fa-solid fa-key"></i>
		<span>{translator.translate('form.submit')}</span>
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
	button#code-scan {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	input {
		border-radius: 0;
	}

	button#code-submit {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
</style>
