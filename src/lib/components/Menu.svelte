<script lang="ts">
	import { resolve } from '$app/paths';
	import { translator } from '$lib/translator/index.svelte';
</script>

<nav aria-label="App-Menü" class="fixed right-0 bottom-0 left-0 sm:top-0 sm:bottom-auto">
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
