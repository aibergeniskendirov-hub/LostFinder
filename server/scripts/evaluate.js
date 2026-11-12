/**
 * Сравнивает смысловой поиск (эмбеддинги + косинусное сходство) с поиском
 * по ключевым словам на размеченных демо-парах "потеряно-найдено" и
 * выводит Recall@5 для обоих методов.
 *
 * Метки правильных пар (seed_pair_id) используются только для проверки
 * результата после ранжирования, а не как признак самого поиска -- ни
 * смысловой, ни ключевой метод не знает заранее, какая пара правильная.
 * Выборка маленькая и синтетическая: это только предварительная оценка,
 * а не доказательство качества на реальных данных.
 *
 * Запуск: npm run evaluate (из server/) или npm run evaluate из корня.
 * Перед запуском нужно сначала выполнить npm run seed.
 */
import { allSeeded } from "../src/db/listingsRepo.js";
import { embedText, cosineSimilarity } from "../src/services/embeddings.js";

const TOP_K = 5;

function listingText(listing) {
  return `${listing.title}. ${listing.description}`;
}

function tokenize(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter((t) => t.length > 2);
}

/** Наивный поиск по ключевым словам: число общих уникальных токенов. */
function keywordScore(queryText, candidateText) {
  const q = new Set(tokenize(queryText));
  const c = new Set(tokenize(candidateText));
  let overlap = 0;
  for (const token of q) if (c.has(token)) overlap++;
  return overlap;
}

function topKIds(scored, k) {
  return scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.id);
}

async function main() {
  const seeded = allSeeded();
  const pairs = new Map(); // pairId -> { lost, found }
  for (const listing of seeded) {
    if (!listing.seedPairId || listing.seedPairId.startsWith("distractor-")) continue;
    const entry = pairs.get(listing.seedPairId) || {};
    entry[listing.type] = listing;
    pairs.set(listing.seedPairId, entry);
  }

  const genuinePairs = [...pairs.values()].filter((p) => p.lost && p.found);
  if (genuinePairs.length === 0) {
    console.error("Нет размеченных пар. Сначала запустите: npm run seed");
    process.exit(1);
  }

  console.log("Предвычисляю эмбеддинги для всех объявлений (одна модель, один проход)...");
  const embeddingById = new Map();
  for (const listing of seeded) {
    embeddingById.set(listing.id, await embedText(listingText(listing)));
  }

  // Каждая пара даёт два запроса: от "потеряно" к пулу "найдено", и наоборот.
  const queries = [];
  for (const { lost, found } of genuinePairs) {
    queries.push({ query: lost, correctAnswerId: found.id, poolType: "found" });
    queries.push({ query: found, correctAnswerId: lost.id, poolType: "lost" });
  }

  let semanticHits = 0;
  let keywordHits = 0;

  for (const { query, correctAnswerId, poolType } of queries) {
    const pool = seeded.filter((l) => l.type === poolType && l.id !== query.id);

    const semanticScored = pool.map((candidate) => ({
      id: candidate.id,
      score: cosineSimilarity(embeddingById.get(query.id), embeddingById.get(candidate.id)),
    }));
    const keywordScored = pool.map((candidate) => ({
      id: candidate.id,
      score: keywordScore(listingText(query), listingText(candidate)),
    }));

    if (topKIds(semanticScored, TOP_K).includes(correctAnswerId)) semanticHits++;
    if (topKIds(keywordScored, TOP_K).includes(correctAnswerId)) keywordHits++;
  }

  const n = queries.length;
  const semanticRecall = semanticHits / n;
  const keywordRecall = keywordHits / n;

  console.log("");
  console.log(`Запросов: ${n} (из ${genuinePairs.length} размеченных пар, обе стороны)`);
  console.log(`Смысловой поиск   Recall@${TOP_K}: ${semanticHits}/${n} = ${(semanticRecall * 100).toFixed(1)}%`);
  console.log(`Поиск по словам   Recall@${TOP_K}: ${keywordHits}/${n} = ${(keywordRecall * 100).toFixed(1)}%`);
  console.log("");
  console.log(
    "Внимание: выборка небольшая и полностью синтетическая (10 размеченных пар). " +
      "Это предварительная оценка направления эффекта, а не статистически надёжное измерение качества."
  );
}

main().catch((err) => {
  console.error("Оценка не выполнена:", err.message);
  process.exit(1);
});
