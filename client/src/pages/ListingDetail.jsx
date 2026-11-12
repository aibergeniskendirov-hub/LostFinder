import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListing, findMatches, closeListing } from "../api.js";
import ListingCard from "../components/ListingCard.jsx";

const TYPE_LABELS = { lost: "Потеряно", found: "Найдено" };
const CATEGORY_LABELS = {
  electronics: "Электроника",
  documents: "Документы",
  keys: "Ключи",
  bags: "Сумки",
  clothing: "Одежда",
  other: "Другое",
};

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [matchState, setMatchState] = useState({ status: "idle" }); // idle|loading|done|error
  const [matchResult, setMatchResult] = useState(null);

  const [code, setCode] = useState("");
  const [closeState, setCloseState] = useState({ status: "idle", message: null });

  function reload() {
    getListing(id)
      .then((data) => setListing(data.listing))
      .catch((err) => setLoadError(err.message));
  }

  useEffect(reload, [id]);

  async function onFindMatches() {
    setMatchState({ status: "loading" });
    try {
      const data = await findMatches(id);
      setMatchResult(data);
      setMatchState({ status: "done" });
    } catch (err) {
      setMatchState({ status: "error", message: err.message });
    }
  }

  async function onClose(e) {
    e.preventDefault();
    setCloseState({ status: "loading", message: null });
    try {
      const data = await closeListing(id, code);
      setListing(data.listing);
      setCloseState({ status: "done", message: "Объявление закрыто. Спасибо!" });
    } catch (err) {
      setCloseState({ status: "error", message: err.message });
    }
  }

  if (loadError) return <div className="alert alert-danger">{loadError}</div>;
  if (!listing) return <div className="empty-state">Загрузка…</div>;

  const oppositeLabel = listing.type === "lost" ? "найденных" : "потерянных";

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        {listing.photoFilename ? (
          <img
            src={`/uploads/${listing.photoFilename}`}
            alt=""
            className="img-fluid rounded border"
          />
        ) : (
          <div className="listing-photo rounded d-flex align-items-center justify-content-center text-bordeaux" style={{ height: 280 }}>
            Фото не приложено
          </div>
        )}
      </div>

      <div className="col-12 col-md-6">
        <span
          className={`badge mb-2 ${
            listing.status === "returned" ? "badge-returned" : listing.type === "lost" ? "badge-lost" : "badge-found"
          }`}
        >
          {listing.status === "returned" ? "Возвращено" : TYPE_LABELS[listing.type]}
        </span>
        <h4>{listing.title}</h4>
        <p>{listing.description}</p>
        <dl className="row small">
          <dt className="col-4 text-muted">Категория</dt>
          <dd className="col-8">{CATEGORY_LABELS[listing.category] || listing.category}</dd>
          <dt className="col-4 text-muted">Место</dt>
          <dd className="col-8">{listing.location}</dd>
          <dt className="col-4 text-muted">Дата</dt>
          <dd className="col-8">{listing.eventDate}</dd>
        </dl>

        {listing.status === "active" && (
          <div className="mt-4">
            <button className="btn btn-bordeaux" onClick={onFindMatches} disabled={matchState.status === "loading"}>
              {matchState.status === "loading" ? "Ищу совпадения…" : `🔎 Найти совпадения среди ${oppositeLabel}`}
            </button>

            {matchState.status === "error" && (
              <div className="alert alert-warning mt-3">{matchState.message}</div>
            )}

            {matchState.status === "done" && matchResult && (
              <div className="mt-3">
                <p className="small text-muted fst-italic">{matchResult.disclaimer}</p>
                {matchResult.matches.length === 0 ? (
                  <div className="alert alert-secondary">
                    Подходящих совпадений не найдено (рассмотрено объявлений: {matchResult.candidatesConsidered}).
                  </div>
                ) : (
                  <div className="row g-3">
                    {matchResult.matches.map((m) => (
                      <div className="col-12" key={m.listing.id}>
                        <div className="d-flex align-items-start gap-2">
                          <div className="flex-grow-1">
                            <ListingCard listing={m.listing} />
                          </div>
                        </div>
                        <div className="small mt-1 ms-1">
                          <span className="match-score text-bordeaux fw-semibold">
                            Оценка сходства: {m.score.toFixed(2)}
                          </span>
                          {" — "}
                          <span className="text-muted">{m.reasons.join(", ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <hr className="my-4" />

            <h6>Вещь нашлась или вернулась к владельцу?</h6>
            <form onSubmit={onClose} className="d-flex gap-2 flex-wrap">
              <input
                className="form-control"
                style={{ maxWidth: 220 }}
                placeholder="Секретный код"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="btn btn-outline-secondary" disabled={closeState.status === "loading"}>
                Отметить как возвращено
              </button>
            </form>
            {closeState.status === "error" && (
              <div className="alert alert-danger mt-2">{closeState.message}</div>
            )}
            {closeState.status === "done" && (
              <div className="alert alert-success mt-2">{closeState.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
