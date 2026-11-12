import crypto from "node:crypto";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // без похожих символов (0/O, 1/I/L)
const CODE_LENGTH = 8;
const SCRYPT_KEYLEN = 64;

/**
 * Случайный секретный код управления объявлением, который показывается
 * автору один раз сразу после создания. Нигде, кроме этого момента, он не
 * возвращается и не логируется.
 */
export function generateControlCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

/**
 * В базе хранится только соль и scrypt-хеш кода, никогда сам код.
 */
export function hashControlCode(code) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(code, salt, SCRYPT_KEYLEN).toString("hex");
  return { hash, salt };
}

export function verifyControlCode(code, hash, salt) {
  const candidate = crypto.scryptSync(code, salt, SCRYPT_KEYLEN);
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return crypto.timingSafeEqual(candidate, stored);
}
