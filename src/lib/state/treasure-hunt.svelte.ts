export type TreasureHunt = {
	id: string;
	name: string;
	description: string;
	public: boolean;
	picture?: string;
	steps: TreasureHuntStep[];
};

type TreasureHuntStepBase = {
	id: string;
	title: string;
	content: TreasureHuntContent[];
};

export type TreasureHuntStep =
	| (TreasureHuntStepBase & { type: 'text' })
	| (TreasureHuntStepBase & { type: 'password'; password: string })
	| (TreasureHuntStepBase & {
			type: 'location';
			location: { latitude: number; longitude: number };
	  })
	| (TreasureHuntStepBase & { type: 'time'; time: number });

export type TreasureHuntContent = {
	type: 'text' | 'link' | 'image' | 'video';
	text?: string;
	url?: string;
};

const progressStorageKey = 'treasure-hunt-progress';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export const treasureHunt = $state<{
	active: TreasureHunt | null;
	progressLoaded: boolean;
	completedStepsByHunt: Record<string, string[]>;
	storageWarning: 'invalid' | 'unavailable' | null;
}>({
	active: null,
	progressLoaded: false,
	completedStepsByHunt: {},
	storageWarning: null
});

export function initializeTreasureHuntState(hunts: TreasureHunt[]) {
	if (typeof window === 'undefined' || treasureHunt.progressLoaded) return;

	let activeHuntId: string | null = null;
	let storedState: unknown = null;
	let savedState: string | null = null;

	try {
		savedState = window.localStorage.getItem(progressStorageKey);
	} catch {
		treasureHunt.storageWarning = 'unavailable';
	}

	if (savedState) {
		try {
			storedState = JSON.parse(savedState);
		} catch {
			treasureHunt.storageWarning = 'invalid';
		}
	}

	const completedStepsByHunt: Record<string, string[]> = {};
	let hasInvalidData = false;

	if (storedState !== null) {
		if (
			!isRecord(storedState) ||
			typeof storedState.completedStepsByHunt !== 'object' ||
			storedState.completedStepsByHunt === null ||
			Array.isArray(storedState.completedStepsByHunt) ||
			(storedState.activeHuntId !== null && typeof storedState.activeHuntId !== 'string')
		) {
			hasInvalidData = true;
		} else {
			const completedSteps = storedState.completedStepsByHunt as Record<string, unknown>;
			activeHuntId = storedState.activeHuntId as string | null;

			for (const [huntId, stepIds] of Object.entries(completedSteps)) {
				const hunt = hunts.find((candidate) => candidate.id === huntId);
				if (!hunt) continue;
				if (!Array.isArray(stepIds)) {
					hasInvalidData = true;
					continue;
				}

				const validStepIds = hunt.steps.map((step) => step.id);
				const completedStepIds = stepIds.filter(
					(stepId): stepId is string => typeof stepId === 'string' && validStepIds.includes(stepId)
				);
				if (
					completedStepIds.length !== stepIds.length ||
					completedStepIds.some((stepId, index) => completedStepIds.indexOf(stepId) !== index)
				) {
					hasInvalidData = true;
				}

				if (completedStepIds.length > 0) {
					completedStepsByHunt[huntId] = completedStepIds.filter(
						(stepId, index) => completedStepIds.indexOf(stepId) === index
					);
				}
			}
		}
	}

	if (hasInvalidData && treasureHunt.storageWarning === null) {
		treasureHunt.storageWarning = 'invalid';
	}
	treasureHunt.completedStepsByHunt = completedStepsByHunt;
	treasureHunt.active = hunts.find((hunt) => hunt.id === activeHuntId) ?? null;
	if (activeHuntId !== null && !treasureHunt.active) hasInvalidData = true;
	if (hasInvalidData && treasureHunt.storageWarning === null) {
		treasureHunt.storageWarning = 'invalid';
	}
	treasureHunt.progressLoaded = true;
}

export function setActiveTreasureHunt(hunt: TreasureHunt) {
	if (treasureHunt.active?.id === hunt.id) return;

	treasureHunt.active = hunt;
	persistTreasureHuntState();
}

export function isStepCompleted(hunt: TreasureHunt, stepId: string) {
	return treasureHunt.completedStepsByHunt[hunt.id]?.includes(stepId) ?? false;
}

export function isStepUnlocked(hunt: TreasureHunt, stepId: string) {
	const stepIndex = hunt.steps.findIndex((step) => step.id === stepId);
	if (stepIndex < 0) return false;
	if (stepIndex === 0) return true;

	return isStepCompleted(hunt, hunt.steps[stepIndex - 1].id);
}

export function getNextTreasureHuntStep(hunt: TreasureHunt) {
	return (
		hunt.steps.find((step) => !isStepCompleted(hunt, step.id) && isStepUnlocked(hunt, step.id)) ??
		hunt.steps.at(-1) ??
		null
	);
}

export function completeTreasureHuntStep(hunt: TreasureHunt, stepId: string) {
	if (!isStepUnlocked(hunt, stepId) || isStepCompleted(hunt, stepId)) return false;

	treasureHunt.completedStepsByHunt = {
		...treasureHunt.completedStepsByHunt,
		[hunt.id]: [...(treasureHunt.completedStepsByHunt[hunt.id] ?? []), stepId]
	};
	persistTreasureHuntState();
	return true;
}

export function resetTreasureHuntProgress(hunt: TreasureHunt) {
	treasureHunt.completedStepsByHunt = Object.fromEntries(
		Object.entries(treasureHunt.completedStepsByHunt).filter(([huntId]) => huntId !== hunt.id)
	);
	if (treasureHunt.active?.id === hunt.id) treasureHunt.active = null;
	persistTreasureHuntState();
}

function persistTreasureHuntState() {
	if (typeof window === 'undefined') return;

	try {
		window.localStorage.setItem(
			progressStorageKey,
			JSON.stringify({
				activeHuntId: treasureHunt.active?.id ?? null,
				completedStepsByHunt: treasureHunt.completedStepsByHunt
			})
		);
		treasureHunt.storageWarning = null;
	} catch {
		treasureHunt.storageWarning = 'unavailable';
	}
}
