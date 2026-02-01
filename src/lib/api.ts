import { Card, Edhrec } from "../types";

export async function fetchRandomCommanderCard(): Promise<Card> {
  const res = await fetch("https://api.scryfall.com/cards/random?q=is%3Acommander+legal%3Acommander");
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
  };

  return card;
}

export async function fetchEdhrecByName(name: string): Promise<Edhrec> {
  // Normalize and strip diacritics so names like "Érika" become "erika" and
  // ligatures or compatibility characters are decomposed (NFKD).
  const slug = name
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
