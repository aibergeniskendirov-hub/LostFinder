import db from "../db/index.js";

const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_ATTEMPTS = 5;

const insertAttempt = db.prepare(
  `INSERT INTO close_attempts (listing_id, attempted_at) VALUES (?, datetime('now'))`
);
const countRecent = db.prepare(
  `SELECT COUNT(*) AS n FROM close_attempts WHERE listing_id = ? AND attempted_at > datetime('now', ?)`
);

/**
 * Ограничивает число попыток ввода секретного кода для одного объявления:
 * не больше MAX_ATTEMPTS попыток за WINDOW_MS. Считает попытки по
 * listing_id, а не по IP, чтобы работать одинаково для всех клиентов MVP.
 */
export function checkCloseRateLimit(listingId) {
  const windowClause = `-${Math.floor(WINDOW_MS / 1000)} seconds`;
  const { n } = countRecent.get(listingId, windowClause);
  if (n >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSeconds: Math.floor(WINDOW_MS / 1000) };
  }
  return { allowed: true };
}

export function recordCloseAttempt(listingId) {
  insertAttempt.run(listingId);
}
