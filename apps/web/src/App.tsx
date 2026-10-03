import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuartierPage from "./pages/QuartierPage";
import RestaurantPage from "./pages/RestaurantPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminQuartiers from "./pages/admin/AdminQuartiers";
import AdminRestaurants from "./pages/admin/AdminRestaurants";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="brand">
          Bayonne Resto
        </NavLink>
        <nav className="nav">
          <NavLink to="/#quartiers">Quartiers</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      {children}
      <footer className="site-footer">Bayonne Resto — quartiers & tables · 2026</footer>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/quartiers/:id"
        element={
          <PublicLayout>
            <QuartierPage />
          </PublicLayout>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <PublicLayout>
            <RestaurantPage />
          </PublicLayout>
        }
      />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminReservations />} />
        <Route path="quartiers" element={<AdminQuartiers />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
      </Route>
    </Routes>
  );
}
