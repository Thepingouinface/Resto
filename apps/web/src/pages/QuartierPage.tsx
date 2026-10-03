import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type Quartier, type Restaurant } from "../api";

export default function QuartierPage() {
  const { id } = useParams();
  const [quartier, setQuartier] = useState<Quartier | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .quartierRestaurants(Number(id))
      .then((data) => {
        setQuartier(data.quartier);
        setRestaurants(data.restaurants);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  return (
    <>
      <div className="page-hero">
        <h1>{quartier?.nom ?? "Quartier"}</h1>
        <p>{quartier?.description}</p>
      </div>
      <section className="section">
        {error && <div className="error">{error}</div>}
        {restaurants.length === 0 && !error ? (
          <p>Aucun restaurant dans ce quartier pour le moment.</p>
        ) : (
          <div className="resto-list">
            {restaurants.map((r) => (
              <article key={r.id} className="resto-item">
                <h3>
                  <Link to={`/restaurants/${r.id}`}>{r.nom}</Link>
                </h3>
                <p>{r.adresse}</p>
                <p>{r.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
