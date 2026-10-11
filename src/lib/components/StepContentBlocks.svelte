<script lang="ts">
	import { marked } from 'marked';
	import sanitizeHtml from 'sanitize-html';
	import StepContentVideo from '#lib/components/StepContentVideo.svelte';
	import type { TreasureHuntContent } from '#lib/state/treasure-hunt.svelte.js';
	import { translator } from '#lib/translator/index.svelte.js';

	let { content, title }: { content: TreasureHuntContent[]; title: string } = $props();

	/* eslint-disable svelte/no-at-html-tags -- Markdown is sanitized before rendering. */
</script>

<div class="flex flex-col gap-4">
	{#each content as block}
		{#if block.type === 'text' && block.text}
			<article class="step-card prose max-w-none">
				{@html sanitizeHtml(marked.parse(block.text, { async: false }))}
			</article>
		{:else if block.type === 'link' && block.url}
			<article class="step-card">
				<a
					href={block.url}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-neutral w-full"
				>
					<i class="fa-solid fa-arrow-up-right-from-square"></i>
					<span>
						{#if block.text}
							{block.text}
						{:else}
							{translator.translate('actions.openLink')}
						{/if}
					</span>
				</a>
			</article>
		{:else if block.type === 'image' && block.url}
			<article class="step-card">
				<img src={block.url} alt={title} class="h-auto max-h-112 w-full rounded-md object-cover" />
			</article>
		{:else if block.type === 'video' && block.url}
			<article class="step-card">
				<StepContentVideo url={block.url} {title} />
			</article>
		{/if}
	{/each}
</div>
