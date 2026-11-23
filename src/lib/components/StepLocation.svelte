<script lang="ts">
	import { onDestroy } from 'svelte';
	import { translator } from '#lib/translator/index.svelte.js';

	const LOCATION_RADIUS_METERS = 25;

	let {
		location,
		onSuccess
	}: {
		location: { latitude: number; longitude: number };
		onSuccess: () => void;
	} = $props();

	let stepMessage = $state('');
	let isChecking = $state(false);
	let locationRequest: number | undefined;

	function cancelLocationRequest() {
		if (locationRequest === undefined) return;

		navigator.geolocation?.clearWatch(locationRequest);
		locationRequest = undefined;
		isChecking = false;
	}

	onDestroy(cancelLocationRequest);

	function checkLocation() {
		if (!navigator.geolocation) {
			stepMessage = translator.translate('messages.locationUnsupported');
			return;
		}

		cancelLocationRequest();
		isChecking = true;
		stepMessage = translator.translate('messages.locationChecking');

		locationRequest = navigator.geolocation.watchPosition(
			({ coords }) => {
				const earthRadius = 6_371_000;
				const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

				const latitudeDelta = toRadians(coords.latitude - location.latitude);
				const longitudeDelta = toRadians(coords.longitude - location.longitude);

				const latitude = toRadians(location.latitude);
				const currentLatitude = toRadians(coords.latitude);

				const distance =
					2 *
					earthRadius *
					Math.asin(
						Math.sqrt(
							Math.sin(latitudeDelta / 2) ** 2 +
								Math.cos(latitude) * Math.cos(currentLatitude) * Math.sin(longitudeDelta / 2) ** 2
						)
					);

				const isWithinRadius = distance + coords.accuracy <= LOCATION_RADIUS_METERS;

				if (isWithinRadius) {
					cancelLocationRequest();
					stepMessage = '';
					onSuccess();
				} else {
					stepMessage = translator.translate('messages.locationDistance', {
						distance: Math.max(0, Math.round(distance - coords.accuracy))
					});
				}
			},
			(error) => {
				cancelLocationRequest();
				stepMessage = translator.translate(
					error.code === error.PERMISSION_DENIED
						? 'messages.locationPermissionDenied'
						: 'messages.locationFailed'
				);
			},
			{
				enableHighAccuracy: true,
				maximumAge: 0
			}
		);
	}
</script>

<section class="step-card flex flex-col gap-4">
	<button class="btn btn-primary w-full" onclick={checkLocation} disabled={isChecking}>
		<i class="fa-solid fa-location-dot"></i>
		<span>{translator.translate('form.checkLocation')}</span>
	</button>

	{#if stepMessage}
		<p role={isChecking ? 'status' : 'alert'}>{stepMessage}</p>
	{/if}
</section>
