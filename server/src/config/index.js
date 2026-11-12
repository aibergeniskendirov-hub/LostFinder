import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// server/src/config -> server/
const SERVER_ROOT = path.resolve(__dirname, "..", "..");

export const PORT = Number(process.env.PORT) || 3001;
export const DB_PATH = path.resolve(SERVER_ROOT, process.env.DB_PATH || "./data/lostfinder.sqlite");
export const UPLOAD_DIR = path.resolve(SERVER_ROOT, process.env.UPLOAD_DIR || "./uploads");
export const MAX_PHOTO_BYTES = Number(process.env.MAX_PHOTO_BYTES) || 5 * 1024 * 1024;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

export const TEXT_FIELD_LIMITS = {
  title: 150,
  description: 2000,
  location: 150,
};

// Разрешённые значения перечисляемых полей
export const LISTING_TYPES = ["lost", "found"];
export const LISTING_STATUSES = ["active", "returned"];
export const CATEGORIES = [
  "electronics",
  "documents",
  "keys",
  "bags",
  "clothing",
  "other",
];

export const CATEGORY_LABELS_RU = {
  electronics: "Электроника",
  documents: "Документы",
  keys: "Ключи",
  bags: "Сумки",
  clothing: "Одежда",
  other: "Другое",
};
