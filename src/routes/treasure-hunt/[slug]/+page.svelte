<script lang="ts">
	import { treasureHunt } from '$lib/state/treasure-hunt.svelte';

	import type { PageProps } from './$types';
	let { params }: PageProps = $props();
	const treasureHuntID = Number(params.slug);

	function setActiveTreasureHunt() {
		treasureHunt.id = treasureHuntID;
	}
</script>

<button on:click={setActiveTreasureHunt}>Jagd starten</button>
