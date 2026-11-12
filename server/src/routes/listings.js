import { Router } from "express";
import {
  insertListing,
  getListingById,
  getListingAuthRow,
  listListings,
  markReturned,
} from "../db/listingsRepo.js";
import { validateListingInput } from "../services/validateListing.js";
import { generateControlCode, hashControlCode, verifyControlCode } from "../services/codes.js";
import { uploadPhoto, persistValidatedPhoto } from "../middleware/upload.js";
import { checkCloseRateLimit, recordCloseAttempt } from "../middleware/rateLimiter.js";
import { findMatches } from "../services/matching.js";
import { getModelStatus } from "../services/embeddings.js";
import { LISTING_TYPES, LISTING_STATUSES, CATEGORIES } from "../config/index.js";

const router = Router();

router.get("/listings", (req, res) => {
  const { type, category, location, status } = req.query;
  if (type && !LISTING_TYPES.includes(type)) {
    return res.status(400).json({ error: "Недопустимый тип." });
  }
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Недопустимая категория." });
  }
  if (status && !LISTING_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Недопустимый статус." });
  }
  const listings = listListings({ type, category, location, status });
  res.json({ listings });
});

router.get("/listings/:id", (req, res) => {
  const listing = getListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Объявление не найдено." });
  res.json({ listing });
});

router.post("/listings", (req, res) => {
  uploadPhoto(req, res, async (multerErr) => {
    if (multerErr) {
      const message =
        multerErr.message === "UNSUPPORTED_MEDIA_TYPE"
          ? "Поддерживаются только фотографии JPG или PNG."
          : multerErr.code === "LIMIT_FILE_SIZE"
            ? "Фотография больше 5 МБ."
            : "Не удалось обработать фотографию.";
      return res.status(400).json({ error: message });
    }

    const errors = validateListingInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: "Проверьте форму.", details: errors });
    }

    let photoFilename = null;
    try {
      photoFilename = await persistValidatedPhoto(req.file);
    } catch (err) {
      return res.status(400).json({ error: "Поддерживаются только настоящие файлы JPG или PNG." });
    }

    const code = generateControlCode();
    const { hash, salt } = hashControlCode(code);

    const listing = insertListing({
      type: req.body.type,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category,
      location: req.body.location.trim(),
      eventDate: req.body.eventDate,
      photoFilename,
      controlCodeHash: hash,
      controlCodeSalt: salt,
    });

    // Код возвращается ровно один раз, прямо сейчас, и нигде больше.
    res.status(201).json({ listing, controlCode: code });
  });
});

router.post("/listings/:id/match", async (req, res) => {
  const listing = getListingById(req.params.id);
  if (!listing) return res.status(404).json({ error: "Объявление не найдено." });
  if (listing.status !== "active") {
    return res.status(400).json({ error: "Закрытые объявления не участвуют в поиске совпадений." });
  }

  const modelStatus = getModelStatus();
  if (modelStatus.status !== "ready") {
    return res.status(503).json({
      error:
        modelStatus.status === "loading"
          ? "Модель ИИ ещё загружается, попробуйте через несколько секунд."
          : "Модель ИИ недоступна: поиск совпадений сейчас не работает.",
      modelStatus: modelStatus.status,
    });
  }

  try {
    const { matches, candidatesConsidered } = await findMatches(listing);
    res.json({
      matches: matches.map((m) => ({
        listing: m.listing,
        score: Number(m.score.toFixed(4)),
        reasons: m.reasons,
      })),
      candidatesConsidered,
      disclaimer:
        "Рекомендация ИИ не подтверждает владельца. Передача вещи возможна только после личной проверки.",
    });
  } catch (err) {
    res.status(503).json({ error: "Модель ИИ недоступна: поиск совпадений сейчас не работает." });
  }
});

router.post("/listings/:id/close", (req, res) => {
  const id = Number(req.params.id);
  const row = getListingAuthRow(id);
  if (!row) return res.status(404).json({ error: "Объявление не найдено." });
  if (row.status !== "active") {
    return res.status(400).json({ error: "Объявление уже закрыто." });
  }

  const limit = checkCloseRateLimit(id);
  if (!limit.allowed) {
    return res.status(429).json({ error: "Слишком много попыток. Попробуйте позже." });
  }
  recordCloseAttempt(id);

  const { code } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Введите секретный код." });
  }

  const ok = verifyControlCode(code.trim(), row.controlCodeHash, row.controlCodeSalt);
  if (!ok) {
    return res.status(403).json({ error: "Неверный секретный код." });
  }

  const listing = markReturned(id);
  res.json({ listing });
});

export default router;
