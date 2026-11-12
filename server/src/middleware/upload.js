import multer from "multer";
import crypto from "node:crypto";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { MAX_PHOTO_BYTES, UPLOAD_DIR } from "../config/index.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png"]);

// Файл сначала принимается в память, чтобы можно было проверить его
// настоящий формат по сигнатуре байтов до того, как он попадёт на диск.
const storage = multer.memoryStorage();

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: MAX_PHOTO_BYTES, files: 1 },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error("UNSUPPORTED_MEDIA_TYPE"));
      return;
    }
    cb(null, true);
  },
}).single("photo");

/**
 * После multer-а файл лежит в req.file.buffer. Эта функция проверяет
 * реальную сигнатуру байтов (не доверяя одному лишь заголовку Content-Type
 * или расширению имени файла) и, если всё в порядке, сохраняет файл под
 * случайным безопасным именем в UPLOAD_DIR. Возвращает имя файла или null,
 * если фото не было приложено.
 */
export async function persistValidatedPhoto(file) {
  if (!file) return null;

  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    const err = new Error("UNSUPPORTED_MEDIA_TYPE");
    err.code = "UNSUPPORTED_MEDIA_TYPE";
    throw err;
  }

  const ext = detected.mime === "image/png" ? ".png" : ".jpg";
  const safeName = `${crypto.randomUUID()}${ext}`;
  const fs = await import("node:fs/promises");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, safeName), file.buffer);
  return safeName;
}
