export interface Card {
    name: string;
    imageUrl: string;
    type: string;
    text: string;
}

export type Edhrec = {
    deck_count?: number;
    decks?: number;
    decks_count?: number;
    num_decks_average?: number;
    cards?: Array<{ name?: string; card?: string }>;
    panels?: {
        taglinks?: Array<{ name?: string; slug?: string; count?: number }>;
    };
    container?: { json_dict?: { card?: { rank?: number } } };
    [k: string]: unknown;
};
