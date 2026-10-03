import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { openDb, migrate, resolveDbPath } from "./db.js";
import { seedDatabase } from "./seed.js";
import { registerRoutes } from "./routes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: path.join(root, ".env") });

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";
const jwtSecret = process.env.JWT_SECRET ?? "dev-only-insecure-secret";

seedDatabase();
const db = openDb(resolveDbPath());
migrate(db);

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") ?? true,
});

await app.register(jwt, {
  secret: jwtSecret,
  sign: { expiresIn: "12h" },
});

registerRoutes(app, db);

await app.listen({ port, host });
console.log(`API Bayonne sur http://${host}:${port}`);
