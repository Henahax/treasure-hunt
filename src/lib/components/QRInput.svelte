<script lang="ts">
	import { translator } from '$lib/translator/index.svelte';
</script>

<label>
	<span>TEST</span>
	<div class="flex">
		<button class="btn btn-primary" aria-label="QR-Code">
			<i class="fa-solid fa-qrcode"></i>
		</button>
		<input type="text" placeholder={translator.translate('form.enter-code')} class="w-full" />
	</div>
</label>

<style>
	input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	button {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
</style>
