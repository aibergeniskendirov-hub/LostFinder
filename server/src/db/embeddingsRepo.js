import db from "./index.js";
import { vectorToBuffer, bufferToVector } from "../services/embeddings.js";
import { MODEL_VERSION } from "../config/matching.js";

const getStmt = db.prepare(
  `SELECT vector FROM embeddings WHERE listing_id = ? AND model_version = ?`
);
const upsertStmt = db.prepare(`
  INSERT INTO embeddings (listing_id, model_version, vector)
  VALUES (@listingId, @modelVersion, @vector)
  ON CONFLICT (listing_id, model_version) DO UPDATE SET vector = excluded.vector, computed_at = datetime('now')
`);

/** Возвращает закэшированный вектор для текущей версии модели, или null. */
export function getCachedEmbedding(listingId) {
  const row = getStmt.get(listingId, MODEL_VERSION);
  return row ? bufferToVector(row.vector) : null;
}

export function saveEmbedding(listingId, vector) {
  upsertStmt.run({
    listingId,
    modelVersion: MODEL_VERSION,
    vector: vectorToBuffer(vector),
  });
}
