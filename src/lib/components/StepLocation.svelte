<script lang="ts">
	import { translator } from '#lib/translator/index.svelte.js';

	let {
		location,
		onSuccess
	}: {
		location: { latitude: number; longitude: number; radius: number };
		onSuccess: () => void;
	} = $props();

	let stepMessage = $state('');

	function checkLocation() {
		if (!navigator.geolocation) {
			stepMessage = translator.translate('messages.locationUnsupported');
			return;
		}

		stepMessage = translator.translate('messages.locationChecking');

		navigator.geolocation.getCurrentPosition(
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
								Math.cos(latitude) *
									Math.cos(currentLatitude) *
									Math.sin(longitudeDelta / 2) ** 2
						)
					);

				console.log({
					targetLat: location.latitude,
					targetLon: location.longitude,
					currentLat: coords.latitude,
					currentLon: coords.longitude,
					accuracy: coords.accuracy,
					distance,
					radius: location.radius
				});

				if (distance <= location.radius) {
					stepMessage = '';
					onSuccess();
				} else {
					stepMessage = `Distanz: ${Math.round(distance)}m | GPS-Genauigkeit: ${Math.round(coords.accuracy)}m | Zielradius: ${location.radius}m`;
				}
			},
			(error) => {
				stepMessage = translator.translate(
					error.code === error.PERMISSION_DENIED
						? 'messages.locationPermissionDenied'
						: 'messages.locationFailed'
				);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0
			}
		);
	}
</script>

<section class="step-card flex flex-col gap-4">
	<button class="btn btn-primary w-full" onclick={checkLocation}>
		<i class="fa-solid fa-location-dot"></i>
		<span>{translator.translate('form.checkLocation')}</span>
	</button>

	{#if stepMessage}
		<p role="status">{stepMessage}</p>
	{/if}
</section>
