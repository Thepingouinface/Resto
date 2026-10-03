import { useEffect, useState } from "react";
import { api, type Reservation, type Restaurant } from "../../api";

export default function AdminReservations() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [restos, setRestos] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.adminRestaurants().then(setRestos).catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    api
      .adminReservations(filter === "" ? undefined : filter)
      .then(setRows)
      .catch((e: Error) => setError(e.message));
  }, [filter]);

  return (
    <>
      <h2>Réservations</h2>
      <p className="lead">Suivi des tables réservées par restaurant.</p>
      {error && <div className="error">{error}</div>}
      <label className="form" style={{ maxWidth: 320, marginBottom: "1rem" }}>
        Restaurant
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Tous</option>
          {restos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>
      </label>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Nom</th>
            <th>Couverts</th>
            <th>Restaurant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.heure}</td>
              <td>{r.nom}</td>
              <td>{r.nombre}</td>
              <td>{r.restaurant_nom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
