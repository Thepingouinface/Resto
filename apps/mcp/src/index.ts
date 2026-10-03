import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: path.join(root, ".env") });

const API_BASE = process.env.API_BASE_URL ?? "http://127.0.0.1:3001";
const ADMIN_TOKEN = process.env.MCP_ADMIN_TOKEN ?? "";

async function api<T>(
  pathname: string,
  init?: RequestInit & { admin?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (init?.admin) {
    if (!ADMIN_TOKEN) {
      throw new Error("MCP_ADMIN_TOKEN manquant pour cet outil admin");
    }
    headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
  }
  const res = await fetch(`${API_BASE}${pathname}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

const server = new Server(
  { name: "bayonne-resto", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_quartiers",
      description: "Liste les quartiers de Bayonne avec le nombre de restaurants",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
    },
    {
      name: "list_restaurants",
      description: "Liste les restaurants d’un quartier",
      inputSchema: {
        type: "object",
        properties: {
          quartierId: { type: "number", description: "ID du quartier" },
        },
        required: ["quartierId"],
        additionalProperties: false,
      },
    },
    {
      name: "get_restaurant",
      description: "Fiche restaurant avec cuisiniers",
      inputSchema: {
        type: "object",
        properties: {
          restaurantId: { type: "number" },
        },
        required: ["restaurantId"],
        additionalProperties: false,
      },
    },
    {
      name: "create_reservation",
      description: "Créer une réservation dans un restaurant",
      inputSchema: {
        type: "object",
        properties: {
          nom: { type: "string" },
          date: { type: "string" },
          heure: { type: "string" },
          nombre: { type: "number" },
          id_restaurant: { type: "number" },
        },
        required: ["nom", "date", "heure", "nombre", "id_restaurant"],
        additionalProperties: false,
      },
    },
    {
      name: "list_reservations",
      description:
        "Lister les réservations (admin). Requiert MCP_ADMIN_TOKEN (JWT).",
      inputSchema: {
        type: "object",
        properties: {
          restaurantId: { type: "number" },
        },
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result: unknown;
    switch (name) {
      case "list_quartiers":
        result = await api("/api/quartiers");
        break;
      case "list_restaurants": {
        const { quartierId } = z.object({ quartierId: z.number() }).parse(args);
        result = await api(`/api/quartiers/${quartierId}/restaurants`);
        break;
      }
      case "get_restaurant": {
        const { restaurantId } = z
          .object({ restaurantId: z.number() })
          .parse(args);
        result = await api(`/api/restaurants/${restaurantId}`);
        break;
      }
      case "create_reservation": {
        const payload = z
          .object({
            nom: z.string(),
            date: z.string(),
            heure: z.string(),
            nombre: z.number(),
            id_restaurant: z.number(),
          })
          .parse(args);
        result = await api("/api/reservations", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        break;
      }
      case "list_reservations": {
        const q = z
          .object({ restaurantId: z.number().optional() })
          .parse(args ?? {});
        const qs = q.restaurantId ? `?restaurantId=${q.restaurantId}` : "";
        result = await api(`/api/admin/reservations${qs}`, { admin: true });
        break;
      }
      default:
        throw new Error(`Outil inconnu: ${name}`);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: (err as Error).message }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
