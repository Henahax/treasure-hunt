<script lang="ts">
	import { resolve } from '$app/paths';
	import { isStepCompleted, isStepUnlocked, treasureHunt } from '$lib/state/treasure-hunt.svelte';
	import { translator } from '$lib/translator/index.svelte';

	const activeHunt = $derived(treasureHunt.active);
	const unlockedSteps = $derived.by(() => {
		if (!activeHunt) return [];

		return activeHunt.steps.flatMap((step, index) =>
			isStepUnlocked(activeHunt, step.id)
				? [{ step, index, completed: isStepCompleted(activeHunt, step.id) }]
				: []
		);
	});
	let dialogElement = $state<HTMLDialogElement>();

	function open() {
		dialogElement?.showModal();
	}

	function close() {
		if (dialogElement?.open) dialogElement.close();
	}
</script>

{#if activeHunt}
	<button
		type="button"
		class="btn btn-ghost btn-menu"
		aria-label={translator.translate('nav.steps')}
		title={translator.translate('nav.steps')}
		onclick={open}
	>
		<i class="fa-solid fa-list-ol"></i>
		<span>{translator.translate('nav.steps')}</span>
	</button>

	<dialog
		bind:this={dialogElement}
		class="steps-dialog"
		aria-labelledby="steps-title"
		onclick={(event) => {
			if (event.target === dialogElement) close();
		}}
	>
		<div class="flex items-center justify-between gap-4">
			<div>
				<h2 id="steps-title">{translator.translate('steps.unlockedTitle')}</h2>
				<p class="hunt-name">{activeHunt.name}</p>
			</div>
			<button
				type="button"
				class="btn btn-neutral btn-icon"
				aria-label={translator.translate('steps.close')}
				title={translator.translate('steps.close')}
				onclick={close}
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
		</div>

		<div class="step-list">
			{#each unlockedSteps as { step, index, completed } (step.id)}
				<a
					href={resolve('/treasure-hunt/[treasureHunt]/[step]', {
						treasureHunt: activeHunt.id,
						step: step.id
					})}
					class="step-link"
					class:completed
					onclick={close}
				>
					<span class="step-number">{index + 1}</span>
					<span class="step-copy">
						<span class="step-status">
							{translator.translate(completed ? 'steps.completed' : 'steps.available')}
						</span>
						<strong>{step.title}</strong>
					</span>
					<i class="fa-solid fa-chevron-right step-arrow" aria-hidden="true"></i>
				</a>
			{:else}
				<p class="empty-state">{translator.translate('steps.noneUnlocked')}</p>
			{/each}
		</div>
	</dialog>
{/if}

<style>
	.steps-dialog {
		position: fixed;
		inset: 0 auto 0 0;
		box-sizing: border-box;
		width: min(26rem, 100vw);
		height: 100dvh;
		max-height: 100dvh;
		margin: 0;
		overflow: hidden;
		padding: 1.25rem;
		border: 0;
		border-right: 1px solid var(--app-color-border);
		background: var(--app-color-panel);
		color: var(--app-color-text);
		opacity: 0;
		transform: translateX(-100%);
		transition:
			opacity 200ms ease,
			transform 200ms ease,
			overlay 200ms allow-discrete,
			display 200ms allow-discrete;
	}

	.steps-dialog[open] {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		opacity: 1;
		transform: translateX(0);
	}

	.steps-dialog::backdrop {
		background: var(--app-color-backdrop);
		opacity: 0;
		transition: opacity 200ms ease;
	}

	.steps-dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		.steps-dialog[open] {
			opacity: 0;
			transform: translateX(-100%);
		}

		.steps-dialog[open]::backdrop {
			opacity: 0;
		}
	}

	.steps-dialog h2 {
		font-size: 1.125rem;
		font-weight: 700;
	}

	.hunt-name,
	.step-status {
		font-size: 0.75rem;
		color: var(--app-color-text-muted);
	}

	.step-list {
		min-height: 0;
		overflow-y: auto;
	}

	.step-link {
		display: grid;
		grid-template-columns: 2.25rem minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.25rem;
		border-bottom: 1px solid var(--app-color-surface);
		color: inherit;
		text-decoration: none;
	}

	.step-link:hover,
	.step-link:focus-visible {
		background: var(--app-color-surface);
	}

	.step-link:focus-visible {
		outline: 2px solid var(--app-color-text-secondary);
		outline-offset: -2px;
	}

	.step-link.completed .step-number {
		background: var(--app-color-border);
	}

	.step-number {
		display: grid;
		width: 2.25rem;
		aspect-ratio: 1;
		place-items: center;
		border-radius: 50%;
		background: var(--app-color-surface);
		font-variant-numeric: tabular-nums;
	}

	.step-copy {
		min-width: 0;
	}

	.step-status {
		display: block;
	}

	.step-copy strong {
		display: block;
		overflow-wrap: anywhere;
	}

	.step-arrow {
		color: var(--app-color-text-muted);
	}

	.empty-state {
		padding-block: 1rem;
		color: var(--app-color-text-muted);
	}

	@media (max-width: 40rem) {
		.steps-dialog {
			inset: auto 0 0;
			width: 100vw;
			height: auto;
			max-height: min(75dvh, calc(100% - 1rem));
			padding: 1.25rem 1rem max(1rem, env(safe-area-inset-bottom));
			border: 0;
			border-top: 1px solid var(--app-color-border);
			border-radius: 1rem 1rem 0 0;
			transform: translateY(100%);
		}

		.steps-dialog[open] {
			transform: translateY(0);
		}

		@starting-style {
			.steps-dialog[open] {
				transform: translateY(100%);
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.steps-dialog,
		.steps-dialog::backdrop {
			transition: none;
		}
	}
</style>
