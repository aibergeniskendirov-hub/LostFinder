import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, getMeta } from "../api.js";
import { validateListingForm, validatePhoto, LIMITS } from "../validateListing.js";

const EMPTY_FORM = {
  type: "lost",
  title: "",
  description: "",
  category: "",
  location: "",
  eventDate: "",
};

export default function CreateListing() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ categories: [] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null); // { listing, controlCode }

  useEffect(() => {
    getMeta()
      .then(setMeta)
      .catch(() => {});
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPhotoChange(e) {
    const file = e.target.files?.[0] || null;
    const err = validatePhoto(file);
    setPhotoError(err);
    setPhoto(err ? null : file);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const fieldErrors = validateListingForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0 || photoError) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const data = await createListing(form, photo);
      setCreated(data);
    } catch (err) {
      setServerError(err.details?.join(" ") || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="row justify-content-center">
        <div className="col-12 col-md-7">
          <div className="card listing-card p-4">
            <h5 className="text-bordeaux">Объявление опубликовано!</h5>
            <p>
              Сохраните этот секретный код — он понадобится, чтобы закрыть объявление
              (отметить вещь как возвращённую). <strong>Он больше нигде не будет показан.</strong>
            </p>
            <div className="control-code-box my-3">{created.controlCode}</div>
            <div className="d-flex gap-2">
              <button className="btn btn-bordeaux" onClick={() => navigate(`/listings/${created.listing.id}`)}>
                Перейти к объявлению
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                На главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-7">
        <h4 className="mb-3">Новое объявление</h4>
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Тип</label>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                id="type-lost"
                checked={form.type === "lost"}
                onChange={() => update("type", "lost")}
              />
              <label className="btn btn-outline-danger" htmlFor="type-lost">
                Потеряно
              </label>
              <input
                type="radio"
                className="btn-check"
                id="type-found"
                checked={form.type === "found"}
                onChange={() => update("type", "found")}
              />
              <label className="btn btn-outline-success" htmlFor="type-found">
                Найдено
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Название</label>
            <input
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={form.title}
              maxLength={LIMITS.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Например: Чёрный рюкзак с ноутбуком"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              rows={4}
              value={form.description}
              maxLength={LIMITS.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Опишите вещь подробно: цвет, приметы, содержимое"
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Категория</label>
              <select
                className={`form-select ${errors.category ? "is-invalid" : ""}`}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">Выберите…</option>
                {meta.categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Дата события</label>
              <input
                type="date"
                className={`form-control ${errors.eventDate ? "is-invalid" : ""}`}
                value={form.eventDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => update("eventDate", e.target.value)}
              />
              {errors.eventDate && <div className="invalid-feedback">{errors.eventDate}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Место</label>
            <input
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
              value={form.location}
              maxLength={LIMITS.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Например: Библиотека, 2 этаж"
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Фотография (необязательно, JPG/PNG, до 5 МБ)</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className={`form-control ${photoError ? "is-invalid" : ""}`}
              onChange={onPhotoChange}
            />
            {photoError && <div className="invalid-feedback">{photoError}</div>}
          </div>

          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <button type="submit" className="btn btn-bordeaux w-100" disabled={submitting}>
            {submitting ? "Публикую…" : "Опубликовать объявление"}
          </button>
        </form>
      </div>
    </div>
  );
}
