const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3001";

export type Quartier = {
  id: number;
  nom: string;
  description: string;
  restaurant_count?: number;
};

export type Restaurant = {
  id: number;
  nom: string;
  adresse: string;
  description: string;
  id_quartier: number;
  quartier_nom?: string;
  cuisiniers?: Cuisinier[];
};

export type Cuisinier = {
  id: number;
  nom: string;
  salaire: number;
  diplome: string;
};

export type Reservation = {
  id: number;
  nom: string;
  date: string;
  heure: string;
  nombre: number;
  id_restaurant: number;
  restaurant_nom?: string;
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("bayonne_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  quartiers: () => request<Quartier[]>("/api/quartiers"),
  quartierRestaurants: (id: number) =>
    request<{ quartier: Quartier; restaurants: Restaurant[] }>(
      `/api/quartiers/${id}/restaurants`,
    ),
  restaurant: (id: number) => request<Restaurant>(`/api/restaurants/${id}`),
  createReservation: (payload: {
    nom: string;
    date: string;
    heure: string;
    nombre: number;
    id_restaurant: number;
  }) =>
    request<{ id: number; message: string }>("/api/reservations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; email: string; role: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  adminReservations: (restaurantId?: number) =>
    request<Reservation[]>(
      `/api/admin/reservations${restaurantId ? `?restaurantId=${restaurantId}` : ""}`,
    ),
  adminRestaurants: () => request<Restaurant[]>("/api/admin/restaurants"),
  createQuartier: (payload: { nom: string; description: string }) =>
    request<{ id: number }>("/api/admin/quartiers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createRestaurant: (payload: {
    nom: string;
    adresse: string;
    description: string;
    id_quartier: number;
  }) =>
    request<{ id: number }>("/api/admin/restaurants", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteRestaurant: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/restaurants/${id}`, { method: "DELETE" }),
};
