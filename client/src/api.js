async function handle(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // пустой ответ -- оставляем body = null
  }
  if (!res.ok) {
    const message = body?.error || `Ошибка запроса (${res.status})`;
    const error = new Error(message);
    error.details = body?.details;
    error.status = res.status;
    throw error;
  }
  return body;
}

export async function getMeta() {
  return handle(await fetch("/api/meta"));
}

export async function getModelStatus() {
  return handle(await fetch("/api/model-status"));
}

export async function listListings(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return handle(await fetch(`/api/listings${query ? `?${query}` : ""}`));
}

export async function getListing(id) {
  return handle(await fetch(`/api/listings/${id}`));
}

export async function createListing(formValues, photoFile) {
  const form = new FormData();
  for (const [key, value] of Object.entries(formValues)) {
    form.append(key, value);
  }
  if (photoFile) form.append("photo", photoFile);
  return handle(await fetch("/api/listings", { method: "POST", body: form }));
}

export async function findMatches(id) {
  return handle(await fetch(`/api/listings/${id}/match`, { method: "POST" }));
}

export async function closeListing(id, code) {
  return handle(
    await fetch(`/api/listings/${id}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
  );
}
