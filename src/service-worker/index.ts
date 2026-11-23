import { version } from '$app/env';
import { assets, immutable } from '$app/manifest';
import { self } from '$app/service-worker';

const CACHE_NAME = `treasure-hunt-${version}`;
const APP_ASSETS = [...new Set([...assets, ...immutable].map(({ path }) => path))];
const PRECACHE_ASSETS = [...new Set([...APP_ASSETS, '/offline.html'])];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter(
							(cacheName) => cacheName.startsWith('treasure-hunt-') && cacheName !== CACHE_NAME
						)
						.map((cacheName) => caches.delete(cacheName))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('message', (event) => {
	const message: unknown = event.data;
	if (
		typeof message !== 'object' ||
		message === null ||
		!('type' in message) ||
		message.type !== 'CACHE_NAVIGATION' ||
		!('url' in message) ||
		typeof message.url !== 'string'
	) {
		return;
	}

	let url: URL;
	try {
		url = new URL(message.url, self.location.origin);
	} catch {
		return;
	}

	if (url.origin !== self.location.origin || url.search) return;

	event.waitUntil(
		(async () => {
			try {
				const response = await fetch(url, { headers: { accept: 'text/html' } });
				if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
					const cache = await caches.open(CACHE_NAME);
					await cache.put(url, response);
				}
			} catch {
				// A route can still be usable in the open app when offline.
			}
		})()
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	if (url.origin !== self.location.origin) return;

	if (event.request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE_NAME);

				try {
					const response = await fetch(event.request);
					if (response.ok) {
						try {
							await cache.put(event.request, response.clone());
						} catch {
							// A cache write failure must not replace a successful network response.
						}
					}
					return response;
				} catch {
					return (
						(await cache.match(event.request)) ??
						(await cache.match('/offline.html')) ??
						Response.error()
					);
				}
			})()
		);
		return;
	}

	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const cachedResponse = await cache.match(event.request);
			return cachedResponse ?? fetch(event.request);
		})
	);
});
