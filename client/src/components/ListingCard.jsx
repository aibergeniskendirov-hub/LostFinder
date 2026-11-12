import { Link } from "react-router-dom";

const TYPE_LABELS = { lost: "Потеряно", found: "Найдено" };
const CATEGORY_LABELS = {
  electronics: "Электроника",
  documents: "Документы",
  keys: "Ключи",
  bags: "Сумки",
  clothing: "Одежда",
  other: "Другое",
};

export default function ListingCard({ listing }) {
  const badgeClass =
    listing.status === "returned" ? "badge-returned" : listing.type === "lost" ? "badge-lost" : "badge-found";
  const badgeText = listing.status === "returned" ? "Возвращено" : TYPE_LABELS[listing.type];

  return (
    <Link to={`/listings/${listing.id}`} className="text-decoration-none text-reset">
      <div className="listing-card h-100">
        {listing.photoFilename ? (
          <img className="listing-photo" src={`/uploads/${listing.photoFilename}`} alt="" />
        ) : (
          <div className="listing-photo d-flex align-items-center justify-content-center text-bordeaux">
            Без фото
          </div>
        )}
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className={`badge ${badgeClass}`}>{badgeText}</span>
            <small className="text-muted">{listing.eventDate}</small>
          </div>
          <h6 className="mb-1">{listing.title}</h6>
          <p className="small text-muted mb-2 text-truncate">{listing.description}</p>
          <div className="small">
            <span className="text-bordeaux">{CATEGORY_LABELS[listing.category] || listing.category}</span>
            {" · "}
            <span className="text-muted">{listing.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
