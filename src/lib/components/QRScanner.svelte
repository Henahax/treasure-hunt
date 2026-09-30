<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import QrScanner from 'qr-scanner';
	import qrScannerWorkerPath from 'qr-scanner/qr-scanner-worker.min.js?url';
	import { translator } from '$lib/translator/index.svelte';

	let {
		onresult,
		onclose
	}: {
		onresult: (code: string) => void;
		onclose: () => void;
	} = $props();

	QrScanner.WORKER_PATH = qrScannerWorkerPath;

	let dialogElement: HTMLDialogElement;
	let videoElement: HTMLVideoElement;
	let scanner: QrScanner | undefined;
	let scanError = $state('');

	function stopScanner() {
		scanner?.stop();
		scanner?.destroy();
		scanner = undefined;
	}

	function close() {
		stopScanner();
		if (dialogElement.open) dialogElement.close();
		onclose();
	}

	function handleCancel(event: Event) {
		event.preventDefault();
		close();
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
			scanError = translator.translate('scanner.cameraError');
		}
	}

	onMount(() => {
		dialogElement.showModal();
		void start();
	});

	onDestroy(stopScanner);
</script>

<dialog
	bind:this={dialogElement}
	class="scanner-dialog"
	aria-labelledby="scanner-title"
	oncancel={handleCancel}
>
	<div class="flex items-center justify-between gap-4">
		<h2 id="scanner-title">{translator.translate('scanner.title')}</h2>
		<button
			type="button"
			class="btn btn-neutral"
			aria-label={translator.translate('scanner.close')}
			title={translator.translate('scanner.close')}
			onclick={close}
		>
			<i class="fa-solid fa-xmark"></i>
		</button>
	</div>
	<video bind:this={videoElement} class="scanner-video" autoplay muted playsinline></video>
	{#if scanError}<p class="text-error">{scanError}</p>{/if}
</dialog>

<style>
	.scanner-dialog {
		box-sizing: border-box;
		width: min(32rem, calc(100vw - 2rem));
		max-height: calc(100% - 2rem);
		margin: auto;
		overflow: auto;
		padding: 1rem;
		border: 1px solid var(--app-color-border);
		border-radius: 0.5rem;
		background: var(--app-color-panel);
		color: var(--app-color-text);
		opacity: 0;
		transform: translateY(0.75rem) scale(0.98);
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			overlay 180ms allow-discrete,
			display 180ms allow-discrete;
	}

	.scanner-dialog[open] {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.scanner-dialog::backdrop {
		background: var(--app-color-backdrop);
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.scanner-dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		.scanner-dialog[open] {
			opacity: 0;
			transform: translateY(0.75rem) scale(0.98);
		}

		.scanner-dialog[open]::backdrop {
			opacity: 0;
		}
	}

	.scanner-dialog h2 {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.scanner-video {
		width: 100%;
		margin-top: 1rem;
		aspect-ratio: 1;
		border-radius: 0.375rem;
		object-fit: cover;
		background: var(--app-color-video);
	}

	@media (max-width: 40rem) {
		.scanner-dialog {
			position: fixed;
			inset: auto 0 0;
			width: 100vw;
			max-width: none;
			max-height: min(85dvh, calc(100% - 1rem));
			margin: 0;
			padding: 1.25rem 1rem max(1rem, env(safe-area-inset-bottom));
			border: 0;
			border-top: 1px solid var(--app-color-border);
			border-radius: 1rem 1rem 0 0;
			transform: translateY(100%);
		}

		.scanner-dialog[open] {
			transform: translateY(0);
		}

		@starting-style {
			.scanner-dialog[open] {
				transform: translateY(100%);
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scanner-dialog,
		.scanner-dialog::backdrop {
			transition: none;
		}
	}
</style>
