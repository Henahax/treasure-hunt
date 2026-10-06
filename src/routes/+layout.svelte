<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	import { translator } from '#lib/translator/index.svelte.js';
	import { resolve } from '$app/paths';
	import TreasureHuntSteps from '#lib/components/TreasureHuntSteps.svelte';
	import {
		initializeTreasureHuntState,
		treasureHunt,
		type TreasureHunt
	} from '#lib/state/treasure-hunt.svelte.js';

	let { children } = $props();
	const isTreasureHuntStep = $derived(page.route.id === '/treasure-hunt/[treasureHunt]/[step]');
	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, hunt]) => hunt);

	onMount(() => initializeTreasureHuntState(treasureHunts));

	onNavigate((navigation) => {
		if (navigation.shallow) return;
		if (!document.startViewTransition) return;

		return new Promise<void>((resolveTransition) => {
			try {
				const transition = document.startViewTransition(() => {
					resolveTransition();
					return navigation.complete;
				});

				void transition.ready.catch(resolveTransition);
				void transition.finished.catch(() => {});
			} catch {
				resolveTransition();
			}
		});
	});

	$effect(() => {
		document.documentElement.lang = translator.locale;
	});
</script>

<svelte:head>
	<title>{translator.translate('app.title')}</title>
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
			aria-label={translator.translate('app.title')}
		>
			<i class="fa-solid fa-map"></i>
			<span>{translator.translate('app.title')}</span>
		</a>
		<ul>
			<li class="sm:hidden">
				<a href={resolve('/')} class="btn btn-ghost btn-menu">
					<i class="fa-solid fa-house"></i>
					<span>{translator.translate('nav.home')}</span>
				</a>
			</li>
			<li>
				{#if treasureHunt.active && isTreasureHuntStep}
					<TreasureHuntSteps />
				{:else if treasureHunt.active}
					<a
						href={resolve('/treasure-hunt/[treasureHunt]', {
							treasureHunt: treasureHunt.active.id
						})}
						class="btn btn-ghost btn-menu"
					>
						<i class="fa-solid fa-play"></i>
						<span>{translator.translate('nav.continue')}</span>
					</a>
				{:else}
					<button class="btn btn-ghost btn-menu" disabled>
						<i class="fa-regular fa-map"></i>
						<span>{translator.translate('app.title')}</span>
					</button>
				{/if}
			</li>
			<li>
				<a href={resolve('treasure-hunts')} class="btn btn-ghost btn-menu">
					<i class="fa-regular fa-compass"></i>
					<span>{translator.translate('nav.browse')}</span>
				</a>
			</li>
		</ul>
	</nav>
</header>

<main class="flex w-full max-w-2xl grow flex-col gap-4 p-4">
	<section id="content" class="flex w-full grow flex-col justify-center gap-4">
		{@render children()}
	</section>

	<footer class="text-subtle flex w-full justify-center text-xs">
		<span class="grow text-center">
			{translator.translate('footer.copyright', { year: new Date().getFullYear() })}
		</span>
	</footer>
</main>

<style>
	:global(body) {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 10;
		width: 100%;
		background-color: var(--app-color-page);

		border-top: none;
		border-bottom: 1px solid var(--app-color-border-strong);
	}

	header nav ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	:global(header .btn-menu) {
		gap: 0.125rem;
		flex-direction: column;
		width: 100%;
	}

	:global(header .btn-menu i) {
		font-size: 1.25rem;
	}

	:global(header .btn-menu span) {
		font-size: 0.75rem;
	}

	@media (width < 40rem) {
		:global(body) {
			flex-direction: column-reverse;
		}

		header {
			position: sticky;
			padding: 0;
			bottom: 0;

			border-bottom: none;
			border-top: 1px solid var(--app-color-border-strong);
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
