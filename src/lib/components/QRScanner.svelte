<script lang="ts">
	import { onDestroy } from 'svelte';
	import QrScanner from 'qr-scanner';
	import qrScannerWorkerPath from 'qr-scanner/qr-scanner-worker.min.js?url';

	let {
		onresult,
		onclose
	}: {
		onresult: (code: string) => void;
		onclose: () => void;
	} = $props();

	QrScanner.WORKER_PATH = qrScannerWorkerPath;

	let videoElement: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scanError = $state('');

	function close() {
		scanner?.stop();
		scanner?.destroy();
		scanner = undefined;
		onclose();
	}

	async function start() {
		try {
			scanner = new QrScanner(
				videoElement,
				(result) => {
					onresult(result.data);
					close();
				},
				{ returnDetailedScanResult: true }
			);
			await scanner.start();
		} catch {
			scanError = 'Die Kamera konnte nicht gestartet werden.';
		}
	}

	$effect(() => {
		if (videoElement) start();
	});

	onDestroy(() => {
		scanner?.stop();
		scanner?.destroy();
	});
</script>

<div class="scanner-backdrop" role="presentation">
	<div
		class="scanner-dialog"
		role="dialog"
		aria-modal="true"
		aria-label="QR-Code scannen"
		tabindex="-1"
	>
		<div class="flex items-center justify-between gap-4">
			<h2>QR-Code scannen</h2>
			<button class="btn btn-neutral" aria-label="Scanner schließen" onclick={close}>
				<i class="fa-solid fa-xmark"></i>
			</button>
		</div>
		<video bind:this={videoElement} class="scanner-video" autoplay muted playsinline></video>
		{#if scanError}<p class="text-error">{scanError}</p>{/if}
	</div>
</div>

<style>
	.scanner-backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgb(0 0 0 / 70%);
	}

	.scanner-dialog {
		width: min(100%, 32rem);
		padding: 1rem;
		background: white;
		border-radius: 0.5rem;
	}

	.scanner-dialog h2 {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.scanner-video {
		width: 100%;
		margin-top: 1rem;
		aspect-ratio: 1;
		object-fit: cover;
		background: black;
	}
</style>
