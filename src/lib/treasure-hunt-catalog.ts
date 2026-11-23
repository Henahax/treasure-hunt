import type { TreasureHunt } from '#lib/state/treasure-hunt.svelte.js';

type UnknownRecord = Record<string, unknown>;

const huntFiles = import.meta.glob<unknown>('/src/lib/treasure-hunts/*.json', {
	eager: true,
	import: 'default'
});

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function hasOnlyKeys(value: UnknownRecord, allowedKeys: string[]): boolean {
	return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function isId(value: unknown): value is string {
	return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isHttpsUrl(value: unknown): value is string {
	if (typeof value !== 'string') return false;

	try {
		return new URL(value).protocol === 'https:';
	} catch {
		return false;
	}
}

function isYouTubeUrl(value: unknown): value is string {
	if (!isHttpsUrl(value)) return false;

	const host = new URL(value).hostname.toLowerCase().replace(/^(www|m)\./, '');
	return host === 'youtube.com' || host === 'youtu.be';
}

function isContentBlock(value: unknown): boolean {
	if (!isRecord(value) || typeof value.type !== 'string') return false;

	switch (value.type) {
		case 'text':
			return hasOnlyKeys(value, ['type', 'text']) && typeof value.text === 'string';
		case 'link':
			return (
				hasOnlyKeys(value, ['type', 'url', 'text']) &&
				isHttpsUrl(value.url) &&
				(value.text === undefined || typeof value.text === 'string')
			);
		case 'image':
			return hasOnlyKeys(value, ['type', 'url']) && isHttpsUrl(value.url);
		case 'video':
			return hasOnlyKeys(value, ['type', 'url']) && isYouTubeUrl(value.url);
		default:
			return false;
	}
}

function isStep(value: unknown): value is TreasureHunt['steps'][number] {
	if (
		!isRecord(value) ||
		!isId(value.id) ||
		!isNonEmptyString(value.title) ||
		typeof value.type !== 'string' ||
		!Array.isArray(value.content) ||
		!value.content.every(isContentBlock)
	) {
		return false;
	}

	switch (value.type) {
		case 'text':
			return hasOnlyKeys(value, ['id', 'title', 'type', 'content']);
		case 'password':
			return (
				hasOnlyKeys(value, ['id', 'title', 'type', 'content', 'password']) &&
				isNonEmptyString(value.password)
			);
		case 'location':
			return (
				hasOnlyKeys(value, ['id', 'title', 'type', 'content', 'location']) &&
				isRecord(value.location) &&
				hasOnlyKeys(value.location, ['latitude', 'longitude']) &&
				typeof value.location.latitude === 'number' &&
				Number.isFinite(value.location.latitude) &&
				value.location.latitude >= -90 &&
				value.location.latitude <= 90 &&
				typeof value.location.longitude === 'number' &&
				Number.isFinite(value.location.longitude) &&
				value.location.longitude >= -180 &&
				value.location.longitude <= 180
			);
		case 'time':
			return (
				hasOnlyKeys(value, ['id', 'title', 'type', 'content', 'time']) &&
				Number.isSafeInteger(value.time) &&
				Number(value.time) >= 0
			);
		default:
			return false;
	}
}

function isTreasureHunt(value: unknown): value is TreasureHunt {
	if (
		!isRecord(value) ||
		!hasOnlyKeys(value, ['id', 'name', 'description', 'public', 'picture', 'steps']) ||
		!isId(value.id) ||
		!isNonEmptyString(value.name) ||
		typeof value.description !== 'string' ||
		typeof value.public !== 'boolean' ||
		(value.picture !== undefined && !isHttpsUrl(value.picture)) ||
		!Array.isArray(value.steps) ||
		value.steps.length === 0 ||
		!value.steps.every(isStep)
	) {
		return false;
	}

	const stepIds = value.steps.map((step: TreasureHunt['steps'][number]) => step.id);
	return new Set(stepIds).size === stepIds.length;
}

const ids = new Set<string>();

export const treasureHunts: TreasureHunt[] = Object.entries(huntFiles)
	.filter(([path]) => !path.endsWith('/schema.json'))
	.map(([path, value]) => {
		if (!isTreasureHunt(value)) {
			throw new Error(`Invalid treasure hunt data in ${path}`);
		}

		if (ids.has(value.id)) {
			throw new Error(`Duplicate treasure hunt id "${value.id}" in ${path}`);
		}

		ids.add(value.id);
		return value;
	});
