import { LISTING_TYPES, CATEGORIES, TEXT_FIELD_LIMITS } from "../config/index.js";

/**
 * Серверная валидация полей объявления. Зеркалит клиентскую проверку в
 * client/src/utils/validateListing.js -- клиентская проверка только для
 * удобства, окончательное решение всегда принимает сервер.
 *
 * @returns {string[]} список ошибок (пустой массив, если всё верно)
 */
export function validateListingInput(body) {
  const errors = [];
  const { type, title, description, category, location, eventDate } = body;

  if (!LISTING_TYPES.includes(type)) {
    errors.push("Тип объявления должен быть 'lost' или 'found'.");
  }
  if (!title || !title.trim()) {
    errors.push("Название обязательно.");
  } else if (title.length > TEXT_FIELD_LIMITS.title) {
    errors.push(`Название не длиннее ${TEXT_FIELD_LIMITS.title} символов.`);
  }
  if (!description || !description.trim()) {
    errors.push("Описание обязательно.");
  } else if (description.length > TEXT_FIELD_LIMITS.description) {
    errors.push(`Описание не длиннее ${TEXT_FIELD_LIMITS.description} символов.`);
  }
  if (!CATEGORIES.includes(category)) {
    errors.push("Недопустимая категория.");
  }
  if (!location || !location.trim()) {
    errors.push("Место обязательно.");
  } else if (location.length > TEXT_FIELD_LIMITS.location) {
    errors.push(`Место не длиннее ${TEXT_FIELD_LIMITS.location} символов.`);
  }
  if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    errors.push("Дата события обязательна и должна быть в формате ГГГГ-ММ-ДД.");
  } else {
    const parsed = new Date(`${eventDate}T00:00:00`);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (Number.isNaN(parsed.getTime())) {
      errors.push("Дата события некорректна.");
    } else if (parsed > today) {
      errors.push("Дата события не может быть в будущем.");
    }
  }

  return errors;
}
