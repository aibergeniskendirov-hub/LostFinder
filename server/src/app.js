import express from "express";
import cors from "cors";
import fs from "node:fs";
import { CLIENT_ORIGIN, UPLOAD_DIR } from "./config/index.js";
import listingsRouter from "./routes/listings.js";
import metaRouter from "./routes/meta.js";

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "200kb" }));

// Статическая раздача фотографий. UPLOAD_DIR содержит только файлы с
// случайными именами, сгенерированными сервером -- не пользовательский ввод.
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api", listingsRouter);
app.use("/api", metaRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Единый обработчик ошибок -- на случай, если что-то выше выбросило
// исключение, не обработанное локально.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Внутренняя ошибка сервера." });
});

export default app;
