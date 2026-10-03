const base = process.env.API_BASE_URL ?? "http://127.0.0.1:3001";

async function main() {
  const health = await fetch(`${base}/api/health`);
  if (!health.ok) throw new Error(`health ${health.status}`);
  const quartiers = await fetch(`${base}/api/quartiers`);
  if (!quartiers.ok) throw new Error(`quartiers ${quartiers.status}`);
  const list = (await quartiers.json()) as unknown[];
  if (!Array.isArray(list) || list.length < 4) {
    throw new Error("seed quartiers manquant");
  }
  const resto = await fetch(`${base}/api/restaurants/1`);
  if (!resto.ok) throw new Error(`restaurant ${resto.status}`);
  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL ?? "admin@bayonne.local",
      password: process.env.ADMIN_PASSWORD ?? "AdminBayonne2026!",
    }),
  });
  if (!login.ok) throw new Error(`login ${login.status}`);
  const { token } = (await login.json()) as { token: string };
  const admin = await fetch(`${base}/api/admin/reservations`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!admin.ok) throw new Error(`admin reservations ${admin.status}`);
  console.log("SMOKE OK");
}

main().catch((err) => {
  console.error("SMOKE FAIL", err);
  process.exit(1);
});
