# Bayonne Resto — modernisation 2026

Stack : **API Fastify** + **front React (Vite)** + **serveur MCP**. Le PHP pédagogique est archivé dans `legacy/`.

## Démarrage

```bash
cp .env.example .env
npm install
npm run seed
npm run dev:api    # http://127.0.0.1:3001
npm run dev:web    # http://127.0.0.1:5173
```

Admin seed : `admin@bayonne.local` / `AdminBayonne2026!`

Smoke API (API déjà démarrée) :

```bash
npm run smoke -w apps/api
```

## MCP (Cursor)

```bash
npm run mcp
```

Exemple `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "bayonne-resto": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": ".",
      "env": {
        "API_BASE_URL": "http://127.0.0.1:3001",
        "MCP_ADMIN_TOKEN": "<jwt optionnel pour list_reservations>"
      }
    }
  }
}
```

Tools : `list_quartiers`, `list_restaurants`, `get_restaurant`, `create_reservation`, `list_reservations`.

## Structure

- `apps/api` — Fastify + SQLite + JWT
- `apps/web` — React public / admin
- `apps/mcp` — MCP stdio
- `legacy/` — ancien site PHP
