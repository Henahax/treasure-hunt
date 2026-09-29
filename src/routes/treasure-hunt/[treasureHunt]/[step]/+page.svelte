<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { marked } from 'marked';
	import {
		completeTreasureHuntStep,
		getNextTreasureHuntStep,
		isStepCompleted,
		isStepUnlocked,
		setActiveTreasureHunt,
		treasureHunt
	} from '$lib/state/treasure-hunt.svelte';
	import type { TreasureHunt } from '$lib/state/treasure-hunt.svelte';

	import type { PageProps } from './$types';
	let { params }: PageProps = $props();

	const treasureHunts = Object.entries(
		import.meta.glob<TreasureHunt>('/src/lib/treasure-hunts/*.json', {
			eager: true,
			import: 'default'
		})
	)
		.filter(([path]) => !path.endsWith('/schema.json'))
		.map(([, hunt]) => hunt);

	const selectedTreasureHunt = $derived(
		treasureHunts.find((hunt) => hunt.id === params.treasureHunt) ?? null
	);
	const selectedStep = $derived(
		selectedTreasureHunt?.steps.find((step) => step.id === params.step) ?? null
	);
	const stepNumber = $derived(
		selectedTreasureHunt?.steps.findIndex((step) => step.id === params.step) ?? -1
	);
	const stepCompleted = $derived(
		selectedTreasureHunt && selectedStep
			? isStepCompleted(selectedTreasureHunt, selectedStep.id)
			: false
	);
	const allStepsCompleted = $derived(
		selectedTreasureHunt?.steps.every((step) => isStepCompleted(selectedTreasureHunt, step.id)) ??
			false
	);
	let currentTime = $state(Date.now());
	const timeAvailable = $derived(
		selectedStep?.type !== 'time' || currentTime >= selectedStep.time * 1000
	);

	let passwordInput = $state('');
	let stepMessage = $state('');
	let redirecting = false;

	$effect(() => {
		if (!treasureHunt.progressLoaded || !selectedTreasureHunt || !selectedStep) return;

		if (!isStepUnlocked(selectedTreasureHunt, selectedStep.id)) {
			const nextStep = getNextTreasureHuntStep(selectedTreasureHunt);
			if (nextStep && !redirecting) {
				redirecting = true;
				void goto(
					resolve('/treasure-hunt/[treasureHunt]/[step]', {
						treasureHunt: selectedTreasureHunt.id,
						step: nextStep.id
					})
				);
			}
			return;
		}

		redirecting = false;
		setActiveTreasureHunt(selectedTreasureHunt);
	});

	$effect(() => {
		if (selectedStep?.type !== 'time') return;

		const timer = window.setInterval(() => {
			currentTime = Date.now();
		}, 1000);

		return () => window.clearInterval(timer);
	});

	function continueToNextStep() {
		if (!selectedTreasureHunt || !selectedStep) return;

		if (!stepCompleted && !completeTreasureHuntStep(selectedTreasureHunt, selectedStep.id)) {
			return;
		}

		const nextStep = selectedTreasureHunt.steps[stepNumber + 1];
		if (nextStep) {
			void goto(
				resolve('/treasure-hunt/[treasureHunt]/[step]', {
					treasureHunt: selectedTreasureHunt.id,
					step: nextStep.id
				})
			);
		}
	}

	function submitPassword(event: SubmitEvent) {
		event.preventDefault();
		if (selectedStep?.type !== 'password') return;

		if (passwordInput.trim() !== selectedStep.password) {
			stepMessage = 'Das Passwort ist nicht korrekt.';
			return;
		}

		stepMessage = '';
		passwordInput = '';
		continueToNextStep();
	}

	function checkLocation() {
		if (selectedStep?.type !== 'location') return;
		if (!navigator.geolocation) {
			stepMessage = 'Die Standortbestimmung wird von diesem Browser nicht unterstützt.';
			return;
		}

		const expectedLocation = selectedStep.location;
		stepMessage = 'Standort wird geprüft ...';
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				const earthRadius = 6_371_000;
				const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
				const latitudeDelta = toRadians(coords.latitude - expectedLocation.latitude);
				const longitudeDelta = toRadians(coords.longitude - expectedLocation.longitude);
				const latitude = toRadians(expectedLocation.latitude);
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

				if (distance <= expectedLocation.radius) {
					stepMessage = '';
					continueToNextStep();
				} else {
					stepMessage = `Du bist noch etwa ${Math.round(distance)} m vom Ziel entfernt.`;
				}
			},
			() => {
				stepMessage = 'Dein Standort konnte nicht ermittelt werden.';
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	}

	function getYouTubeEmbedUrl(videoUrl: string): string | null {
		try {
			const url = new URL(videoUrl);
			const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
			let videoId: string | null = null;

			if (host === 'youtu.be') {
				videoId = url.pathname.slice(1).split('/')[0] ?? null;
			} else if (host === 'youtube.com') {
				videoId =
					url.searchParams.get('v') ??
					url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ??
					null;
			}

			if (!videoId || !/^[\w-]+$/.test(videoId)) return null;

			const timestamp =
				url.searchParams.get('t') ??
				url.searchParams.get('start') ??
				new URLSearchParams(url.hash.slice(1)).get('t');
			const timeParts = timestamp?.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
			const start = timestamp
				? /^\d+$/.test(timestamp)
					? Number(timestamp)
					: timeParts?.some((part, index) => index > 0 && part !== undefined)
						? Number(timeParts[1] ?? 0) * 3600 +
							Number(timeParts[2] ?? 0) * 60 +
							Number(timeParts[3] ?? 0)
						: 0
				: 0;
			const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);

			if (start > 0) embedUrl.searchParams.set('start', String(start));
			return embedUrl.toString();
		} catch {
			return null;
		}
	}
</script>

{#if !treasureHunt.progressLoaded}
	<p>Fortschritt wird geladen ...</p>
{:else if selectedTreasureHunt && selectedStep && isStepUnlocked(selectedTreasureHunt, selectedStep.id)}
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between gap-4 text-sm">
			<a
				href={resolve('/treasure-hunt/[treasureHunt]', {
					treasureHunt: selectedTreasureHunt.id
				})}
			>
				{selectedTreasureHunt.name}
			</a>
			<span>{stepNumber + 1} / {selectedTreasureHunt.steps.length}</span>
		</div>

		<h1 class="text-2xl font-bold">{selectedStep.title}</h1>

		{#if selectedStep.type === 'time' && !timeAvailable}
			<p>
				Dieser Schritt wird freigeschaltet am
				<time datetime={new Date(selectedStep.time * 1000).toISOString()}>
					{new Date(selectedStep.time * 1000).toLocaleString()}
				</time>
				.
			</p>
		{:else}
			{#each selectedStep.content as content}
				{#if content.type === 'text' && content.text}
					<div class="prose max-w-none prose-invert">
						{@html marked.parse(content.text)}
					</div>
				{:else if content.type === 'link' && content.url}
					<a href={content.url} target="_blank" rel="noreferrer" class="btn btn-neutral w-fit">
						<i class="fa-solid fa-arrow-up-right-from-square"></i>
						<span>Link öffnen</span>
					</a>
				{:else if content.type === 'image' && content.url}
					<img
						src={content.url}
						alt={selectedStep.title}
						class="h-auto max-h-112 w-full rounded-md object-cover"
					/>
				{:else if content.type === 'video' && content.url}
					{#if getYouTubeEmbedUrl(content.url)}
						<iframe
							src={getYouTubeEmbedUrl(content.url) ?? undefined}
							title={selectedStep.title}
							class="aspect-video w-full rounded-md"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						></iframe>
					{/if}
				{/if}
			{/each}
		{/if}

		{#if allStepsCompleted && selectedStep.id === selectedTreasureHunt.steps.at(-1)?.id}
			<p role="status">Jagd abgeschlossen!</p>
		{:else if selectedStep.type === 'password' && !stepCompleted}
			<form class="flex flex-wrap items-end gap-2" onsubmit={submitPassword}>
				<label class="flex flex-col gap-1">
					<span>Passwort</span>
					<input class="input input-bordered" type="password" bind:value={passwordInput} required />
				</label>
				<button type="submit" class="btn btn-primary">Prüfen</button>
			</form>
		{:else if selectedStep.type === 'location' && !stepCompleted}
			<button class="btn btn-primary w-fit" onclick={checkLocation}>Standort prüfen</button>
		{:else if timeAvailable}
			<button class="btn btn-primary w-fit" onclick={continueToNextStep}>
				{stepNumber === selectedTreasureHunt.steps.length - 1 ? 'Jagd abschließen' : 'Weiter'}
			</button>
		{/if}

		{#if stepMessage}
			<p role="status">{stepMessage}</p>
		{/if}
	</div>
{:else if selectedTreasureHunt && selectedStep}
	<p>Dieser Schritt ist noch gesperrt. Du wirst zum nächsten offenen Schritt weitergeleitet.</p>
{:else}
	<div class="flex flex-col gap-4">
		<p>Der Step wurde nicht gefunden.</p>
		{#if selectedTreasureHunt}
			<a
				href={resolve('/treasure-hunt/[treasureHunt]', {
					treasureHunt: selectedTreasureHunt.id
				})}
			>
				Zur Jagd
			</a>
		{/if}
	</div>
{/if}
