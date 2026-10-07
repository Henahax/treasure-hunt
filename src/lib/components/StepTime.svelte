<script lang="ts">
	import { translator } from '#lib/translator/index.svelte.js';

	let {
		time,
		timeAvailable,
		remainingSeconds
	}: {
		time: number;
		timeAvailable: boolean;
		remainingSeconds: number;
	} = $props();
	const countdownText = $derived(formatCountdown(remainingSeconds));
	const releaseDate = $derived(new Date(time * 1000));

	function formatCountdown(totalSeconds: number) {
		const days = Math.floor(totalSeconds / 86_400);
		const hours = Math.floor((totalSeconds % 86_400) / 3_600);
		const minutes = Math.floor((totalSeconds % 3_600) / 60);
		const seconds = totalSeconds % 60;
		const clock = [hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(':');

		if (days === 0) return clock;

		const dayLabel = translator.translate(days === 1 ? 'steps.day' : 'steps.days');
		return `${days} ${dayLabel} ${clock}`;
	}
</script>

{#if timeAvailable}
	<p role="status">{translator.translate('steps.timeUnlocked')}</p>
{:else}
	<div class="time-gate">
		<p class="time-caption">{translator.translate('steps.countdown')}</p>
		<p
			class="countdown text-center"
			role="timer"
			aria-live="off"
			style={`--countdown-font-size: ${160 / countdownText.length}cqw`}
		>
			{countdownText}
		</p>
		<p class="release-date">
			{translator.translate('steps.releaseAt')}
			<time datetime={releaseDate.toISOString()}>
				{releaseDate.toLocaleString(translator.locale, {
					dateStyle: 'long',
					timeStyle: 'short'
				})}
			</time>
		</p>
	</div>
{/if}

<style>
	.time-gate {
		min-width: 0;
		container-type: inline-size;
	}

	.countdown {
		padding: 1rem 0;
		font-weight: bold;
		font-size: var(--countdown-font-size);
		font-family: ui-monospace, 'Courier New', monospace;
		line-height: 1;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
</style>
