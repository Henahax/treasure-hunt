<script lang="ts">
	import { resolve } from '$app/paths';
	import { translator } from '$lib/translator/index.svelte';
</script>

<nav aria-label="App-Menü" class="border-t border-neutral-700 bg-neutral-800 p-2">
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
