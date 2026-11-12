import { Router } from "express";
import { CATEGORIES, CATEGORY_LABELS_RU, LISTING_TYPES, LISTING_STATUSES } from "../config/index.js";
import { getModelStatus } from "../services/embeddings.js";

const router = Router();

router.get("/meta", (req, res) => {
  res.json({
    categories: CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS_RU[value] })),
    types: LISTING_TYPES,
    statuses: LISTING_STATUSES,
  });
});

router.get("/model-status", (req, res) => {
  res.json(getModelStatus());
});

export default router;
