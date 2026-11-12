/**
 * Загружает синтетические демоданные: 10 размеченных пар "потеряно-найдено"
 * (20 объявлений) и 10 похожих, но неверных дистракторов -- итого 30.
 * Повторный запуск не создаёт дубликатов (проверяет флаг в seed_meta).
 *
 * Запуск: npm run seed  (из папки server/) или npm run seed из корня.
 */
import db from "../src/db/index.js";
import { insertListing } from "../src/db/listingsRepo.js";
import { generateControlCode, hashControlCode } from "../src/services/codes.js";
import { PAIRS, DISTRACTORS } from "./seedData.js";

const SEED_FLAG_KEY = "demo_seeded_v1";

function alreadySeeded() {
  const row = db.prepare(`SELECT value FROM seed_meta WHERE key = ?`).get(SEED_FLAG_KEY);
  return Boolean(row);
}

function markSeeded() {
  db.prepare(`INSERT OR REPLACE INTO seed_meta (key, value) VALUES (?, datetime('now'))`).run(
    SEED_FLAG_KEY
  );
}

function createListing(data, seedPairId) {
  const code = generateControlCode();
  const { hash, salt } = hashControlCode(code);
  return insertListing({
    ...data,
    photoFilename: null,
    controlCodeHash: hash,
    controlCodeSalt: salt,
    seedPairId,
  });
}

function run() {
  if (alreadySeeded()) {
    console.log(
      "Демоданные уже были загружены ранее (отметка в seed_meta). Пропускаю, дубликаты не создаются."
    );
    return;
  }

  let created = 0;

  for (const pair of PAIRS) {
    createListing({ type: "lost", ...pair.lost }, pair.pairId);
    createListing({ type: "found", ...pair.found }, pair.pairId);
    created += 2;
  }

  for (const d of DISTRACTORS) {
    const { seedPairId, ...rest } = d;
    createListing(rest, seedPairId);
    created += 1;
  }

  markSeeded();
  console.log(`Готово: создано ${created} демо-объявлений (${PAIRS.length} размеченных пар + ${DISTRACTORS.length} дистракторов).`);
}

run();
