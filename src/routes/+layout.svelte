<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import Menu from '$lib/components/Menu.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto_auto]">
	<header class="p-4">
		<h1>{translator.t('title')}</h1>
	</header>

	<main id="content" class="flex min-w-0 flex-col items-center justify-center p-4">
		{@render children()}
	</main>

	<footer class="p-4">Copyright © 2026 Henahax</footer>

	<Menu />
</div>
