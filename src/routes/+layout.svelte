<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header>
	<h1>Treasure Hunt</h1>
</header>

<div id="content">
	{@render children()}
</div>

<footer>Test</footer>
