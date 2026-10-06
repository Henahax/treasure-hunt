<script lang="ts">
	let { url, title }: { url: string; title: string } = $props();
	const embedUrl = $derived(getYouTubeEmbedUrl(url));

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

{#if embedUrl}
	<iframe
		src={embedUrl}
		{title}
		class="aspect-video w-full rounded-md"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
{/if}
