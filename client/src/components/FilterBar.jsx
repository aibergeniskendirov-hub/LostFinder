export default function FilterBar({ filters, onChange, categories, locations }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="row g-2 mb-4">
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.type || ""}
          onChange={(e) => set("type", e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="lost">Потеряно</option>
          <option value="found">Найдено</option>
        </select>
      </div>
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.category || ""}
          onChange={(e) => set("category", e.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.location || ""}
          onChange={(e) => set("location", e.target.value)}
        >
          <option value="">Все места</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6 col-md-3">
        <select
          className="form-select"
          value={filters.status || ""}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="returned">Возвращённые</option>
        </select>
      </div>
    </div>
  );
}
