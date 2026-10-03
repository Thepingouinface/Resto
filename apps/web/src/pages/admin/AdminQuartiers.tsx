import { FormEvent, useEffect, useState } from "react";
import { api, type Quartier } from "../../api";

export default function AdminQuartiers() {
  const [list, setList] = useState<Quartier[]>([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function refresh() {
    return api.quartiers().then(setList);
  }

  useEffect(() => {
    refresh().catch((e: Error) => setError(e.message));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await api.createQuartier({ nom, description });
      setOk("Quartier créé");
      setNom("");
      setDescription("");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <>
      <h2>Quartiers</h2>
      <p className="lead">Ajouter un quartier à l’annuaire.</p>
      {error && <div className="error">{error}</div>}
      {ok && <div className="flash">{ok}</div>}
      <form className="form panel" onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
        <label>
          Nom
          <input required minLength={3} value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label>
          Description
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Créer
        </button>
      </form>
      <ul className="cook-list">
        {list.map((q) => (
          <li key={q.id}>
            <span>
              <strong>{q.nom}</strong> — {q.description}
            </span>
            <span>{q.restaurant_count ?? 0} restos</span>
          </li>
        ))}
      </ul>
    </>
  );
}
