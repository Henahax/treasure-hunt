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
        location: { latitude: number; longitude: number; radius: number };
    })
    | (TreasureHuntStepBase & { type: 'time'; time: number });

export type TreasureHuntContent = {
    type: 'text' | 'link' | 'image' | 'video';
    text?: string;
    url?: string;
};

const progressStorageKey = 'treasure-hunt-progress';

export const treasureHunt = $state<{
    active: TreasureHunt | null;
    progressLoaded: boolean;
    completedStepsByHunt: Record<string, string[]>;
}>({
    active: null,
    progressLoaded: false,
    completedStepsByHunt: {}
});

export function initializeTreasureHuntState(hunts: TreasureHunt[]) {
    if (typeof window === 'undefined' || treasureHunt.progressLoaded) return;

    let activeHuntId: string | null = null;
    let storedState: unknown;

    try {
        const savedState = window.localStorage.getItem(progressStorageKey);
        if (savedState) storedState = JSON.parse(savedState);
    } catch {
        storedState = undefined;
    }

    const completedStepsByHunt: Record<string, string[]> = {};

    if (storedState && typeof storedState === 'object') {
        const stored = storedState as Record<string, unknown>;
        if (typeof stored.activeHuntId === 'string') activeHuntId = stored.activeHuntId;

        if (stored.completedStepsByHunt && typeof stored.completedStepsByHunt === 'object') {
            for (const [huntId, stepIds] of Object.entries(stored.completedStepsByHunt)) {
                const hunt = hunts.find((candidate) => candidate.id === huntId);
                if (!hunt || !Array.isArray(stepIds)) continue;

                const completedStepIds = stepIds.filter(
                    (stepId): stepId is string =>
                        typeof stepId === 'string' && hunt.steps.some((step) => step.id === stepId)
                );

                if (completedStepIds.length > 0) {
                    completedStepsByHunt[huntId] = completedStepIds;
                }
            }
        }
    }

    treasureHunt.completedStepsByHunt = completedStepsByHunt;
    treasureHunt.active = hunts.find((hunt) => hunt.id === activeHuntId) ?? null;
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
    } catch {
        return;
    }
}
