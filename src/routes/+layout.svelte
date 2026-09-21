<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto_auto]">
	<header class="p-4">
		<h1>Treasure Hunt</h1>
	</header>

	<main id="content" class="flex min-w-0 flex-col items-center justify-center p-4">
		{@render children()}
	</main>

	<footer class="p-4">Copyright © 2026 Henahax</footer>

	<nav aria-label="App-Menü" class="border-t border-neutral-700 bg-neutral-800 p-2">
		<ul class="mx-auto flex max-w-md items-center justify-around gap-2">
			<li>
				<a href={resolve('/')} class="btn btn-ghost">Home</a>
			</li>
			<li>
				<a href={resolve('/treasure-hunts')} class="btn btn-ghost">Treasure Hunts</a>
			</li>
		</ul>
	</nav>
</div>
