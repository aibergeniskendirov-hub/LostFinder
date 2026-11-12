import { embedText, cosineSimilarity } from "./embeddings.js";
import { getCachedEmbedding, saveEmbedding } from "../db/embeddingsRepo.js";
import { listActiveCandidates } from "../db/listingsRepo.js";
import {
  WEIGHTS,
  MATCH_THRESHOLD,
  TOP_K,
  DATE_PROXIMITY_WINDOW_DAYS,
} from "../config/matching.js";

const OPPOSITE_TYPE = { lost: "found", found: "lost" };

function listingText(listing) {
  return `${listing.title}. ${listing.description}`;
}

async function getOrComputeEmbedding(listing) {
  const cached = getCachedEmbedding(listing.id);
  if (cached) return cached;
  const vector = await embedText(listingText(listing));
  saveEmbedding(listing.id, vector);
  return vector;
}

function dateProximityScore(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffDays = Math.abs((a - b) / (1000 * 60 * 60 * 24));
  if (diffDays >= DATE_PROXIMITY_WINDOW_DAYS) return 0;
  return 1 - diffDays / DATE_PROXIMITY_WINDOW_DAYS;
}

/**
 * Находит до TOP_K вероятных совпадений для объявления, среди активных
 * объявлений противоположного типа.
 *
 * @returns {Promise<{matches: Array, candidatesConsidered: number}>}
 */
export async function findMatches(listing) {
  const oppositeType = OPPOSITE_TYPE[listing.type];
  const candidates = listActiveCandidates(oppositeType, listing.id);

  const queryVector = await getOrComputeEmbedding(listing);

  const scored = [];
  for (const candidate of candidates) {
    const candidateVector = await getOrComputeEmbedding(candidate);
    const semantic = cosineSimilarity(queryVector, candidateVector);

    const categoryMatch = candidate.category === listing.category;
    const locationMatch =
      candidate.location.trim().toLowerCase() === listing.location.trim().toLowerCase();
    const dateScore = dateProximityScore(listing.eventDate, candidate.eventDate);

    const score =
      WEIGHTS.semantic * semantic +
      WEIGHTS.category * (categoryMatch ? 1 : 0) +
      WEIGHTS.location * (locationMatch ? 1 : 0) +
      WEIGHTS.date * dateScore;

    const reasons = [];
    if (categoryMatch) reasons.push("совпала категория");
    if (locationMatch) reasons.push("совпало место");
    if (dateScore > 0) reasons.push("близкие даты");
    if (reasons.length === 0) reasons.push("совпадение найдено только по смыслу описания");

    scored.push({
      listing: candidate,
      score,
      semanticSimilarity: semantic,
      reasons,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const matches = scored.filter((m) => m.score >= MATCH_THRESHOLD).slice(0, TOP_K);

  return { matches, candidatesConsidered: candidates.length };
}

export { getOrComputeEmbedding, listingText };
