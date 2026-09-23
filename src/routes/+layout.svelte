<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import Menu from '$lib/components/Menu.svelte';

	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto_auto]">
	<nav aria-label="App-Menu" class="border-t border-neutral-700 bg-red-500 p-2 sm:bg-green-500">
		<ul class="mx-auto flex max-w-md items-center justify-around gap-2">
			<li>
				<a href={resolve('/')} class="btn btn-ghost">
					<i class="fa-solid fa-house"></i>
					{translator.t('nav.home')}
				</a>
			</li>
			<li>
				<a href={resolve('/treasure-hunts')} class="btn btn-ghost">
					<i class="fa-solid fa-map"></i>
					{translator.t('nav.treasure-hunts')}
				</a>
			</li>
		</ul>
	</nav>
	<header class="p-4">
		<h1>{translator.t('title')}</h1>
	</header>

	<main id="content" class="flex min-w-0 flex-col items-center justify-center p-4">
		{@render children()}
	</main>

	<footer class="p-4">Copyright © 2026 Henahax</footer>

	<Menu />
</div>
