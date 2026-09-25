<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { translator } from '$lib/translator/index.svelte';
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

<header class="flex px-4">
	<nav class="mx-auto flex max-w-7xl grow items-center justify-between gap-8">
		<a
			id="title"
			class="btn btn-ghost h-full text-xl"
			href={resolve('/')}
			aria-label={translator.translate('title')}
		>
			<i class="fa-solid fa-map"></i>
			<span>{translator.translate('title')}</span>
		</a>
		<ul>
			<li class="sm:hidden">
				<a href={resolve('/')} class="btn btn-ghost btn-menu">
					<i class="fa-solid fa-house"></i>
					<span>{translator.translate('nav.home')}</span>
				</a>
			</li>
			<li>
				<a href={resolve('/treasure-hunts')} class="btn btn-ghost btn-menu">
					<i class="fa-regular fa-map"></i>
					<span>{translator.translate('nav.browse')}</span>
				</a>
			</li>
			<li>
				<a href={resolve('/treasure-hunts')} class="btn btn-ghost btn-menu">
					<i class="fa-regular fa-compass"></i>
					<span>{translator.translate('nav.browse')}</span>
				</a>
			</li>
		</ul>
	</nav>
</header>

<main class="flex w-full max-w-7xl grow flex-col gap-4 p-4">
	<section id="content" class="mx-auto flex grow flex-col justify-center gap-4">
		{@render children()}
	</section>

	<footer class="flex w-full justify-between text-xs text-neutral-500">
		<span class="grow text-center">Copyright © 2026 Henahax</span>
		<a href="https://github.henahax.net/treasure-hunt" class="">
			<i class="fa-brands fa-github"></i>
			<span>Source</span>
		</a>
	</footer>
</main>

<style>
	:root {
		--menu-border: var(--color-neutral-500);
	}

	:global(body) {
		min-height: 100dvh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	header {
		position: sticky;
		top: 0;
		width: 100%;

		border-top: none;
		border-bottom: 1px solid var(--menu-border);
	}

	header nav ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	header .btn-menu {
		gap: 0.25rem;
		flex-direction: column;
	}

	header .btn-menu i {
		font-size: 1.25rem;
	}

	header .btn-menu span {
		font-size: 0.75rem;
	}

	main {
		overflow-y: auto;
	}

	@media (width < 40rem) {
		:global(body) {
			flex-direction: column-reverse;
		}

		header {
			position: sticky;
			bottom: 0;

			border-bottom: none;
			border-top: 1px solid var(--menu-border);
		}

		header #title {
			display: none;
		}

		header nav ul {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
