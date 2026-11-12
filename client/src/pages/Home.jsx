import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listListings, getMeta } from "../api.js";
import ListingCard from "../components/ListingCard.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function Home() {
  const [listings, setListings] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [meta, setMeta] = useState({ categories: [] });
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    getMeta()
      .then(setMeta)
      .catch(() => {});
    listListings()
      .then((data) => setAllListings(data.listings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setListings(null);
    setError(null);
    listListings(filters)
      .then((data) => setListings(data.listings))
      .catch((err) => setError(err.message));
  }, [filters]);

  const locations = useMemo(
    () => [...new Set(allListings.map((l) => l.location))].sort(),
    [allListings]
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Лента объявлений</h4>
        <Link to="/create" className="btn btn-bordeaux d-none d-md-inline-block">
          + Добавить объявление
        </Link>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        categories={meta.categories}
        locations={locations}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {listings === null && !error && (
        <div className="empty-state">Загрузка объявлений…</div>
      )}

      {listings !== null && listings.length === 0 && (
        <div className="empty-state">
          <p className="fs-5">Объявлений по этим фильтрам пока нет.</p>
          <Link to="/create" className="btn btn-bordeaux">
            Добавить первое объявление
          </Link>
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="row g-3">
          {listings.map((listing) => (
            <div className="col-12 col-sm-6 col-lg-4" key={listing.id}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
