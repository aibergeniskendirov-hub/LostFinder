// Клиентская проверка -- только для удобства пользователя (мгновенная
// обратная связь до отправки). Окончательное решение всегда принимает
// сервер (см. server/src/services/validateListing.js), который зеркалит
// эти же правила.

export const LIMITS = { title: 150, description: 2000, location: 150 };

export function validateListingForm({ type, title, description, category, location, eventDate }) {
  const errors = {};

  if (!type) errors.type = "Выберите тип объявления.";

  if (!title?.trim()) errors.title = "Название обязательно.";
  else if (title.length > LIMITS.title) errors.title = `Не длиннее ${LIMITS.title} символов.`;

  if (!description?.trim()) errors.description = "Описание обязательно.";
  else if (description.length > LIMITS.description)
    errors.description = `Не длиннее ${LIMITS.description} символов.`;

  if (!category) errors.category = "Выберите категорию.";

  if (!location?.trim()) errors.location = "Место обязательно.";
  else if (location.length > LIMITS.location) errors.location = `Не длиннее ${LIMITS.location} символов.`;

  if (!eventDate) {
    errors.eventDate = "Дата обязательна.";
  } else {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (eventDate > todayStr) errors.eventDate = "Дата не может быть в будущем.";
  }

  return errors;
}

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function validatePhoto(file) {
  if (!file) return null;
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return "Поддерживаются только файлы JPG или PNG.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Фотография больше 5 МБ.";
  }
  return null;
}
