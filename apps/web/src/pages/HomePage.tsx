import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Quartier } from "../api";

export default function HomePage() {
  const [quartiers, setQuartiers] = useState<Quartier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .quartiers()
      .then(setQuartiers)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-brand">Bayonne Resto</h1>
          <p>
            Les tables des quartiers de Bayonne — cuisine basque, quais de la
            Nive, et réservations en un geste.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#quartiers">
              Explorer les quartiers
            </a>
            <Link className="btn btn-ghost" to="/restaurants/1">
              Voir une table
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="quartiers">
        <h2>Quartiers</h2>
        <p className="lead">
          Choisissez un quartier pour découvrir ses restaurants.
        </p>
        {error && <div className="error">{error}</div>}
        <div className="quartier-list">
          {quartiers.map((q, i) => (
            <Link
              key={q.id}
              to={`/quartiers/${q.id}`}
              className="quartier-row"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div>
                <h3 className="quartier-name">{q.nom}</h3>
                <p className="quartier-meta">{q.description}</p>
              </div>
              <span className="quartier-meta">
                {q.restaurant_count ?? 0} resto
                {(q.restaurant_count ?? 0) > 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
