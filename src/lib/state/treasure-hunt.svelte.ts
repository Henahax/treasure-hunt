export type TreasureHunt = {
    id: string;
    name: string;
    description: string;
    steps: TreasureHuntStep[];
};

export type TreasureHuntStep = {
    id: string;
    title: string;
    type: 'text' | 'password' | 'location' | 'time';
    content: TreasureHuntContent[];
};

export type TreasureHuntContent = {
    type: 'text' | 'link' | 'image';
    text?: string;
    url?: string;
};

export const treasureHunt = $state<{ active: TreasureHunt | null }>({
    active: null
});