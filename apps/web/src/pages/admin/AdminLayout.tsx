import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("bayonne_token");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  function logout() {
    localStorage.removeItem("bayonne_token");
    navigate("/admin/login");
  }

  if (!token) return null;

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link to="/" className="brand" style={{ marginRight: "auto" }}>
          Bayonne Resto
        </Link>
        <NavLink to="/admin" end>
          Réservations
        </NavLink>
        <NavLink to="/admin/quartiers">Quartiers</NavLink>
        <NavLink to="/admin/restaurants">Restaurants</NavLink>
        <button type="button" onClick={logout}>
          Déconnexion
        </button>
      </nav>
      <section className="section">
        <Outlet />
      </section>
    </div>
  );
}
