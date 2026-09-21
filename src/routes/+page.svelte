<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1>Treasure Hunt</h1>

<div class="flex w-fit flex-col gap-4">
	<button type="button" class="btn btn-primary">Continue</button>

	<div class="flex gap-4">
		<input type="text" placeholder="Enter your code here" />
		<button class="btn btn-primary">Submit</button>
	</div>

	<a href={resolve('/treasure-hunts')} class="btn btn-neutral">Browse Treasure Hunts</a>
</div>
