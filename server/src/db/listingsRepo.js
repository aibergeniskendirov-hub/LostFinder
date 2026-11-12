import db from "./index.js";

const PUBLIC_COLUMNS = `
  id, type, title, description, category, location, event_date AS eventDate,
  photo_filename AS photoFilename, status, created_at AS createdAt, returned_at AS returnedAt
`;

export function insertListing({
  type,
  title,
  description,
  category,
  location,
  eventDate,
  photoFilename,
  controlCodeHash,
  controlCodeSalt,
  seedPairId = null,
}) {
  const stmt = db.prepare(`
    INSERT INTO listings
      (type, title, description, category, location, event_date, photo_filename,
       control_code_hash, control_code_salt, seed_pair_id)
    VALUES (@type, @title, @description, @category, @location, @eventDate, @photoFilename,
            @controlCodeHash, @controlCodeSalt, @seedPairId)
  `);
  const info = stmt.run({
    type,
    title,
    description,
    category,
    location,
    eventDate,
    photoFilename,
    controlCodeHash,
    controlCodeSalt,
    seedPairId,
  });
  return getListingById(info.lastInsertRowid);
}

export function getListingById(id) {
  return db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM listings WHERE id = ?`).get(id);
}

export function getListingAuthRow(id) {
  return db
    .prepare(`SELECT id, status, control_code_hash AS controlCodeHash, control_code_salt AS controlCodeSalt FROM listings WHERE id = ?`)
    .get(id);
}

export function listListings({ type, category, location, status }) {
  const clauses = [];
  const params = {};
  if (type) {
    clauses.push("type = @type");
    params.type = type;
  }
  if (category) {
    clauses.push("category = @category");
    params.category = category;
  }
  if (location) {
    clauses.push("location = @location");
    params.location = location;
  }
  if (status) {
    clauses.push("status = @status");
    params.status = status;
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT ${PUBLIC_COLUMNS} FROM listings ${where} ORDER BY created_at DESC`)
    .all(params);
}

/** Кандидаты для ИИ-поиска: активные объявления противоположного типа. */
export function listActiveCandidates(oppositeType, excludeId) {
  return db
    .prepare(
      `SELECT ${PUBLIC_COLUMNS} FROM listings WHERE type = ? AND status = 'active' AND id != ?`
    )
    .all(oppositeType, excludeId);
}

export function markReturned(id) {
  db.prepare(
    `UPDATE listings SET status = 'returned', returned_at = datetime('now') WHERE id = ?`
  ).run(id);
  return getListingById(id);
}

export function countListings() {
  return db.prepare(`SELECT COUNT(*) AS n FROM listings`).get().n;
}

export function findBySeedPairId(seedPairId) {
  return db.prepare(`SELECT id FROM listings WHERE seed_pair_id = ?`).all(seedPairId);
}

export function allSeeded() {
  return db
    .prepare(`SELECT ${PUBLIC_COLUMNS}, seed_pair_id AS seedPairId FROM listings WHERE seed_pair_id IS NOT NULL`)
    .all();
}
