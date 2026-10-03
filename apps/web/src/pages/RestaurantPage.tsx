import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type Restaurant } from "../api";

export default function RestaurantPage() {
  const { id } = useParams();
  const [resto, setResto] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "",
    date: "",
    heure: "",
    nombre: 2,
  });

  useEffect(() => {
    if (!id) return;
    api
      .restaurant(Number(id))
      .then(setResto)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!resto) return;
    setError(null);
    setOk(null);
    try {
      const res = await api.createReservation({
        ...form,
        nombre: Number(form.nombre),
        id_restaurant: resto.id,
      });
      setOk(res.message);
      setForm({ nom: "", date: "", heure: "", nombre: 2 });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const mapsUrl = resto
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(resto.adresse)}`
    : "#";

  return (
    <>
      <div className="page-hero">
        <h1>{resto?.nom ?? "Restaurant"}</h1>
        <p>
          {resto?.quartier_nom} · {resto?.adresse}
        </p>
      </div>
      <section className="section">
        {error && <div className="error">{error}</div>}
        {ok && <div className="flash">{ok}</div>}
        {resto && (
          <div className="fiche-grid">
            <div>
              <p>{resto.description}</p>
              <a className="map-link" href={mapsUrl} target="_blank" rel="noreferrer">
                Voir sur OpenStreetMap →
              </a>
              <div className="panel" style={{ marginTop: "1.5rem" }}>
                <h2>Brigade</h2>
                <ul className="cook-list">
                  {(resto.cuisiniers ?? []).map((c) => (
                    <li key={c.id}>
                      <span>{c.nom}</span>
                      <span className="quartier-meta">{c.diplome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="panel">
              <h2>Réserver une table</h2>
              <form className="form" onSubmit={onSubmit}>
                <label>
                  Nom
                  <input
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                </label>
                <label>
                  Date
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
                <label>
                  Heure
                  <input
                    required
                    type="time"
                    value={form.heure}
                    onChange={(e) => setForm({ ...form, heure: e.target.value })}
                  />
                </label>
                <label>
                  Couverts
                  <input
                    required
                    type="number"
                    min={1}
                    max={50}
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: Number(e.target.value) })
                    }
                  />
                </label>
                <button className="btn btn-primary" type="submit">
                  Confirmer
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
