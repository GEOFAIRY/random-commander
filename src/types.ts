export interface Card {
  name: string;
  imageUrl: string;
  type: string;
  text: string;
  faceCount?: number;
  keywords: string[];
}

export type PartnerConstraint =
  | { type: 'none' }
  | { type: 'partner' }
  | { type: 'partner_with'; partnerName: string }
  | { type: 'partner_designator'; designator: string }
  | { type: 'background' }
  | { type: 'doctors_companion' }
  | { type: 'restricted_other' };

export function detectPartnerConstraint(card: Card): PartnerConstraint {
  const text = card.text;
  const keywords = card.keywords;

  // Check for "Partner with [specific card name]"
  const partnerWithMatch = text.match(/Partner with (.+?)(?:\.|,|$)/i);
  const partnerWithName = partnerWithMatch?.[1]?.trim();
  if (partnerWithName) {
    return { type: 'partner_with', partnerName: partnerWithName };
  }

  // Check for "Partner—[Designator]" (various partner subtypes)
  const partnerDesignatorMatch = text.match(/Partner—([^(\n]+)/i);
  const partnerDesignator = partnerDesignatorMatch?.[1]?.trim();
  if (partnerDesignator) {
    return { type: 'partner_designator', designator: partnerDesignator };
  }

  // Check for "Choose a Background"
  if (text.includes('Choose a Background')) {
    return { type: 'background' };
  }

  // Check for "Doctor's companion"
  if (text.includes("Doctor's companion")) {
    return { type: 'doctors_companion' };
  }

  // Check for generic "Partner" keyword
  if (keywords.includes('Partner')) {
    return { type: 'partner' };
  }

  return { type: 'none' };
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
