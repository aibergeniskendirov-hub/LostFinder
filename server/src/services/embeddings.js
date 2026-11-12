import { pipeline, env } from "@huggingface/transformers";
import { EMBEDDING_MODEL } from "../config/matching.js";

// В Node модель один раз скачивается с Hugging Face Hub и кэшируется на диске
// (по умолчанию в .cache рядом с пакетом). Не отключаем удалённую загрузку,
// иначе первый запуск не сможет скачать модель.
env.allowLocalModels = true;

let extractorPromise = null;
let modelReady = false;
let modelLoadError = null;

/**
 * Ленивая, однократная загрузка модели эмбеддингов. Все последующие вызовы
 * переиспользуют тот же экземпляр пайплайна — модель не перезагружается на
 * каждый запрос.
 */
function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL, {
      dtype: "q8",
    })
      .then((extractor) => {
        modelReady = true;
        return extractor;
      })
      .catch((err) => {
        modelLoadError = err;
        extractorPromise = null; // позволить повторную попытку при следующем вызове
        throw err;
      });
  }
  return extractorPromise;
}

// Начинаем загрузку сразу при старте сервера, чтобы первый реальный запрос
// не ждал скачивание модели с нуля.
getExtractor().catch(() => {
  /* ошибка уже сохранена в modelLoadError, здесь только гасим unhandled rejection */
});

export function getModelStatus() {
  if (modelReady) return { status: "ready" };
  if (modelLoadError) return { status: "error", message: modelLoadError.message };
  return { status: "loading" };
}

/**
 * Возвращает нормализованный вектор эмбеддинга (Float32Array) для строки.
 * @param {string} text
 * @returns {Promise<Float32Array>}
 */
export async function embedText(text) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Float32Array.from(output.data);
}

/**
 * Косинусное сходство двух уже нормализованных векторов -- это просто
 * скалярное произведение.
 */
export function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

export function vectorToBuffer(vector) {
  return Buffer.from(Float32Array.from(vector).buffer);
}

export function bufferToVector(buffer) {
  return new Float32Array(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  );
}
