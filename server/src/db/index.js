import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { DB_PATH } from "../config/index.js";

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    type              TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    title             TEXT NOT NULL,
    description       TEXT NOT NULL,
    category          TEXT NOT NULL,
    location          TEXT NOT NULL,
    event_date        TEXT NOT NULL, -- YYYY-MM-DD
    photo_filename    TEXT,
    status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned')),
    control_code_hash TEXT NOT NULL,
    control_code_salt TEXT NOT NULL,
    seed_pair_id      TEXT,          -- используется только демоданными/оценкой качества
    created_at        TEXT NOT NULL DEFAULT (datetime('now')),
    returned_at       TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_listings_type_status ON listings(type, status);
  CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);

  CREATE TABLE IF NOT EXISTS embeddings (
    listing_id    INTEGER NOT NULL,
    model_version TEXT NOT NULL,
    vector        BLOB NOT NULL,
    computed_at   TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (listing_id, model_version),
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS seed_meta (
    key   TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS close_attempts (
    listing_id  INTEGER NOT NULL,
    attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_close_attempts_listing ON close_attempts(listing_id, attempted_at);
`);

export default db;
