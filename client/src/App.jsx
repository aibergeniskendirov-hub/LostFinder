import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand bg-white border-bottom shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🔎 LostFinder
          </Link>
          <div className="ms-auto">
            <Link to="/create" className="btn btn-bordeaux">
              + Добавить объявление
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </main>

      <footer className="text-center text-muted py-4 small">
        LostFinder — учебный MVP для Narxoz University. Все данные демо-режима вымышленные.
      </footer>
    </>
  );
}
