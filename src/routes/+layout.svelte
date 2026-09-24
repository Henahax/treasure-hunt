<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css"
		integrity="sha512-QeR2VH+lsBE5LSAe1Q5EnTBbe7XTBubt8dG93Y7gidSgdMCr8nVqKcfKAMyN96SV8KDbZVTDXChatu5G2KQGzg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<div class="grid h-dvh min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto]">
	<nav aria-label="App-Menu" class="flex items-center justify-center gap-2">
		<a
			class="flex items-center justify-center gap-2 p-2 font-bold max-sm:hidden"
			href={resolve('/')}
			aria-label={translator.t('title')}
		>
			<i class="fa-solid fa-map"></i>
			{translator.t('title')}
		</a>
		<ul class="mx-auto flex max-w-md items-center justify-around">
			<li>
				<a href={resolve('/')} class="btn btn-ghost btn-mobile-menu">
					<i class="fa-solid fa-house"></i>
					<span class="max-sm:hidden">{translator.t('nav.home')}</span>
				</a>
			</li>
			<li>
				<a href={resolve('/treasure-hunts')} class="btn btn-ghost btn-mobile-menu">
					<i class="fa-solid fa-map"></i>
					<span class="max-sm:hidden">{translator.t('nav.treasure-hunts')}</span>
				</a>
			</li>
		</ul>
	</nav>

	<main id="content" class="flex min-w-0 flex-col items-center p-4">
		<div class="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
			{@render children()}
		</div>

		<footer class="w-full text-center text-xs text-neutral-500">Copyright © 2026 Henahax</footer>
	</main>
</div>

<style>
	.btn-mobile-menu {
		font-size: 1.5rem;
		padding: 0.5em;
	}

	main {
		grid-row: 2;
	}

	nav {
		background-color: blue;
		grid-row: 1;
		position: sticky;
		top: 0;
	}

	@media (width < 40rem) {
		nav {
			background-color: red;
			grid-row: 3;
			top: auto;
			position: sticky;
			bottom: 0;
		}
	}
</style>
