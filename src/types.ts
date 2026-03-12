export interface Card {
  name: string;
  scryfallId?: string;
  imageUrl: string;
  type: string;
  text: string;
  faceCount?: number;
  keywords: string[];
  colorIdentity?: string[];
}

export type Filters = {
  types: string[];
  cmcRanges: string[];
  partnerOnly: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  types: [],
  cmcRanges: [],
  partnerOnly: false,
};

export type PartnerConstraint =
  | { type: 'none' }
  | { type: 'partner' }
  | { type: 'partner_with'; partnerName: string }
  | { type: 'partner_designator'; designator: string }
  | { type: 'background' }
  | { type: 'doctors_companion' }
  | { type: 'doctor' };

export function detectPartnerConstraint(card: Card): PartnerConstraint {
  const text = card.text;
  const keywords = card.keywords;

  // Check for "Partner with [specific card name]" — stop at "(" (reminder text) or newline
  const partnerWithMatch = text.match(/Partner with (.+?)(?:\s*\(|\n|$)/i);
  const partnerWithName = partnerWithMatch?.[1]?.trim();
  if (partnerWithName) {
    return { type: 'partner_with', partnerName: partnerWithName };
  }

  // Check for "Partner—[Designator]" (various partner subtypes like "Friends forever")
  const partnerDesignatorMatch = text.match(/Partner—([^(\n]+)/i);
  const partnerDesignator = partnerDesignatorMatch?.[1]?.trim();
  if (partnerDesignator) {
    return { type: 'partner_designator', designator: partnerDesignator };
  }

  // Check for "Choose a Background"
  if (text.includes('Choose a Background')) {
    return { type: 'background' };
  }

  // Check for "Doctor's companion" keyword
  if (keywords.includes("Doctor's companion") || text.includes("Doctor's companion")) {
    return { type: 'doctors_companion' };
  }

  // Check for generic "Partner" keyword (must come last — designator variants also have "Partner" in keywords)
  if (keywords.includes('Partner')) {
    return { type: 'partner' };
  }

  // Check for Time Lord Doctor — these pair with Doctor's companion cards
  // Doctors don't have a partner keyword; detection is by type line only
  if (card.type.includes('Time Lord') && card.type.includes('Doctor')) {
    return { type: 'doctor' };
  }

  return { type: 'none' };
}

export type Edhrec = {
  deck_count?: number;
  decks?: number;
  decks_count?: number;
  num_decks_average?: number;
  num_decks_avg?: number;
  cards?: Array<{ name?: string; card?: string }>;
  panels?: {
    taglinks?: Array<{ name?: string; slug?: string; count?: number }>;
  };
  container?: { json_dict?: { card?: { rank?: number } } };
  [k: string]: unknown;
};
