import { FormEvent, useEffect, useState } from "react";
import { api, type Quartier, type Restaurant } from "../../api";

export default function AdminRestaurants() {
  const [list, setList] = useState<Restaurant[]>([]);
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    description: "",
    id_quartier: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function refresh() {
    const [r, q] = await Promise.all([api.adminRestaurants(), api.quartiers()]);
    setList(r);
    setQuartiers(q);
    if (q[0]) setForm((f) => ({ ...f, id_quartier: q[0].id }));
  }

  useEffect(() => {
    refresh().catch((e: Error) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await api.createRestaurant(form);
      setOk("Restaurant créé");
      setForm((f) => ({ ...f, nom: "", adresse: "", description: "" }));
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function remove(id: number) {
    if (!confirm("Supprimer ce restaurant ?")) return;
    try {
      await api.deleteRestaurant(id);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <>
      <h2>Restaurants</h2>
      <p className="lead">Créer ou retirer un établissement.</p>
      {error && <div className="error">{error}</div>}
      {ok && <div className="flash">{ok}</div>}
      <form className="form panel" onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
        <label>
          Nom
          <input
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
        </label>
        <label>
          Adresse
          <input
            required
            value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          Quartier
          <select
            value={form.id_quartier}
            onChange={(e) =>
              setForm({ ...form, id_quartier: Number(e.target.value) })
            }
          >
            {quartiers.map((q) => (
              <option key={q.id} value={q.id}>
                {q.nom}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Créer
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Quartier</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              <td>{r.nom}</td>
              <td>{r.quartier_nom}</td>
              <td>
                <button type="button" className="btn btn-ghost" style={{ color: "var(--atlantic)" }} onClick={() => remove(r.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
