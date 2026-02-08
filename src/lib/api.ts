import { Card, Edhrec, PartnerConstraint, detectPartnerConstraint } from "../types";

function isValidPartnerPair(mainCard: Card, partnerCard: Card, constraint: PartnerConstraint): boolean {
  const partnerConstraint = detectPartnerConstraint(partnerCard);

  switch (constraint.type) {
    case "none":
      // Main card has no partner ability, invalid
      return false;

    case "partner":
      // Both must have "partner" keyword
      return partnerConstraint.type === "partner";

    case "partner_with":
      // Partner card must have the exact same "partner with" pointing back to main card
      return (
        partnerConstraint.type === "partner_with" &&
        partnerConstraint.partnerName === mainCard.name
      );

    case "partner_designator":
      // Partner card must have the same designator
      return (
        partnerConstraint.type === "partner_designator" &&
        partnerConstraint.designator === constraint.designator
      );

    case "background":
      // Partner must be a Background enchantment
      return partnerCard.type.includes("Background") &&
             partnerCard.type.includes("Enchantment");

    case "doctors_companion":
      // Partner must be a Doctor's companion card
      return partnerConstraint.type === "doctors_companion";

    default:
      return false;
  }
}

export async function fetchRandomCommanderCard(
  colors: string[] = [],
): Promise<Card> {
  const res = await fetch(
    colors.length === 0
      ? "https://api.scryfall.com/cards/random?q=is%3Acommander+legal%3Acommander"
      : `https://api.scryfall.com/cards/random?q=is%3Acommander+legal%3Acommander+id=${colors.toString().replace(",", "")}`,
  );
  if (!res.ok) throw new Error(`Scryfall response ${res.status}`);
  const data = await res.json();

  const card: Card = {
    name: data.name,
    imageUrl:
      (!data.card_faces && data.image_uris?.normal) ||
      (data.layout === "transform" && data.card_faces[0].image_uris?.normal) ||
      "",
    type: data.type_line,
    text: data.oracle_text || "",
    faceCount: data.card_faces ? data.card_faces.length : 1,
    keywords: data.keywords
  };

  return card;
}

export async function fetchRandomPartnerCard(
  colors: string[] = [],
  constraint?: PartnerConstraint,
  mainCard?: Card,
  maxRetries: number = 5,
): Promise<Card | null> {
  // If no constraint, we can't find a valid partner
  if (!constraint || constraint.type === "none") {
    return null;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let query = "is%3Acommander+legal%3Acommander";

      // Build query based on partner constraint
      if (constraint.type === "partner") {
        // Generic partner - fetch any partner card
        query += "+is%3Apartner+o:%22Partner%22";
      } else if (constraint.type === "partner_with") {
        // Partner with specific card
        query += `+o:${encodeURIComponent(`"Partner with ${constraint.partnerName}"`)}`;
      } else if (constraint.type === "partner_designator") {
        // Partner designator - search for cards with the same designator in text
        query += `+o:${encodeURIComponent(`"Partner—${constraint.designator}"`)}`;
      } else if (constraint.type === "background") {
        // Choose a Background - fetch a Background enchantment
        query = "t%3ABackground+is%3Aenchantment+is%3Alegendary+legal%3Acommander";
      } else if (constraint.type === "doctors_companion") {
        // Doctor's companion - fetch a Time Lord card with Doctor in type
        query = "o:%22Doctor%27s+companion%22+legal%3Acommander";
      }

      // Add color filter if provided
      if (colors.length > 0) {
        query += `+id=${colors.toString().replace(",", "")}`;
      }

      const res = await fetch(
        `https://api.scryfall.com/cards/random?q=${query}`,
      );
      if (!res.ok) throw new Error(`Scryfall response ${res.status}`);
      const data = await res.json();

      const card: Card = {
        name: data.name,
        imageUrl:
          (!data.card_faces && data.image_uris?.normal) ||
          (data.layout === "transform" && data.card_faces[0].image_uris?.normal) ||
          "",
        type: data.type_line,
        text: data.oracle_text || "",
        faceCount: data.card_faces ? data.card_faces.length : 1,
        keywords: data.keywords,
      };

      // Validate the pair if we have the main card
      if (mainCard && !isValidPartnerPair(mainCard, card, constraint)) {
        // Invalid pair, retry
        lastError = new Error("Invalid partner pair");
        continue;
      }

      return card;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Continue to next attempt
    }
  }

  // Failed all retries
  console.error(
    `Failed to find valid partner after ${maxRetries} attempts:`,
    lastError,
  );
  return null;
}

export async function fetchEdhrecByName(
  name: string,
  faceCount = 1,
): Promise<Edhrec> {
  // Normalize and strip diacritics so names like "Érika" become "erika" and
  // ligatures or compatibility characters are decomposed (NFKD).
  const cleanedName = faceCount > 1 ? name.replace(/\s*\/\/.*$/g, "") : name;
  const slug = cleanedName
    .normalize("NFKD")
    // remove combining diacritical marks
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2019\u2018']/g, "'")
    .replace(/'s\b/gi, "s")
    .replace(/'/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const url = `https://json.edhrec.com/pages/commanders/${slug}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EDHREC response ${res.status}`);
  const data = await res.json();
  return data as Edhrec;
}
