import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bayonne.local");
  const [password, setPassword] = useState("AdminBayonne2026!");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("bayonne_token", res.token);
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="admin-shell">
      <div className="page-hero">
        <h1>Admin</h1>
        <p>Connexion à l’espace de gestion Bayonne Resto.</p>
      </div>
      <section className="section" style={{ maxWidth: 420 }}>
        {error && <div className="error">{error}</div>}
        <form className="form panel" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Se connecter
          </button>
        </form>
      </section>
    </div>
  );
}
