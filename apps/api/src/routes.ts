import type { FastifyInstance } from "fastify";
import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAdmin } from "./auth.js";

export function registerRoutes(app: FastifyInstance, db: Database.Database): void {
  app.get("/api/health", async () => ({
    ok: true,
    service: "bayonne-api",
    ts: new Date().toISOString(),
  }));

  app.post("/api/auth/login", async (request, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: "Identifiants invalides" });
    }
    const user = db
      .prepare("SELECT id, email, password_hash, role FROM utilisateur WHERE email = ?")
      .get(body.data.email) as
      | { id: number; email: string; password_hash: string; role: string }
      | undefined;
    if (!user || !bcrypt.compareSync(body.data.password, user.password_hash)) {
      return reply.code(401).send({ error: "Email ou mot de passe incorrect" });
    }
    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { token, email: user.email, role: user.role };
  });

  app.get("/api/quartiers", async () => {
    return db
      .prepare(
        `SELECT q.id, q.nom, q.description,
                (SELECT COUNT(*) FROM restaurant r WHERE r.id_quartier = q.id) AS restaurant_count
         FROM quartier q
         ORDER BY q.nom`,
      )
      .all();
  });

  app.get<{ Params: { id: string } }>(
    "/api/quartiers/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      const quartier = db
        .prepare("SELECT id, nom, description FROM quartier WHERE id = ?")
        .get(id);
      if (!quartier) return reply.code(404).send({ error: "Quartier introuvable" });
      return quartier;
    },
  );

  app.get<{ Params: { id: string } }>(
    "/api/quartiers/:id/restaurants",
    async (request, reply) => {
      const id = Number(request.params.id);
      const quartier = db
        .prepare("SELECT id, nom, description FROM quartier WHERE id = ?")
        .get(id);
      if (!quartier) return reply.code(404).send({ error: "Quartier introuvable" });
      const restaurants = db
        .prepare(
          `SELECT id, nom, adresse, description, id_quartier
           FROM restaurant WHERE id_quartier = ? ORDER BY nom`,
        )
        .all(id);
      return { quartier, restaurants };
    },
  );

  app.get<{ Params: { id: string } }>(
    "/api/restaurants/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      const restaurant = db
        .prepare(
          `SELECT r.id, r.nom, r.adresse, r.description, r.id_quartier,
                  q.nom AS quartier_nom
           FROM restaurant r
           JOIN quartier q ON q.id = r.id_quartier
           WHERE r.id = ?`,
        )
        .get(id) as Record<string, unknown> | undefined;
      if (!restaurant) {
        return reply.code(404).send({ error: "Restaurant introuvable" });
      }
      const cuisiniers = db
        .prepare(
          `SELECT c.id, c.nom, c.salaire, d.nom AS diplome
           FROM cuisinier c
           JOIN diplome d ON d.id = c.id_diplome
           WHERE c.id_restaurant = ?
           ORDER BY c.nom`,
        )
        .all(id);
      return { ...restaurant, cuisiniers };
    },
  );

  app.post("/api/reservations", async (request, reply) => {
    const body = z
      .object({
        nom: z.string().min(1).max(100),
        date: z.string().min(1).max(100),
        heure: z.string().min(1).max(100),
        nombre: z.number().int().min(1).max(50),
        id_restaurant: z.number().int().positive(),
      })
      .safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({ error: "Données de réservation invalides", details: body.error.flatten() });
    }
    const resto = db
      .prepare("SELECT id FROM restaurant WHERE id = ?")
      .get(body.data.id_restaurant);
    if (!resto) return reply.code(404).send({ error: "Restaurant introuvable" });

    const result = db
      .prepare(
        `INSERT INTO reservation (nom, date, heure, nombre, id_restaurant)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(
        body.data.nom,
        body.data.date,
        body.data.heure,
        body.data.nombre,
        body.data.id_restaurant,
      );
    return reply.code(201).send({
      id: Number(result.lastInsertRowid),
      message: "Réservation enregistrée",
    });
  });

  // --- Admin ---
  app.get(
    "/api/admin/reservations",
    { preHandler: requireAdmin },
    async (request) => {
      const q = request.query as { restaurantId?: string };
      if (q.restaurantId) {
        return db
          .prepare(
            `SELECT r.id, r.nom, r.date, r.heure, r.nombre, r.id_restaurant,
                    rest.nom AS restaurant_nom
             FROM reservation r
             JOIN restaurant rest ON rest.id = r.id_restaurant
             WHERE r.id_restaurant = ?
             ORDER BY r.date DESC, r.heure DESC`,
          )
          .all(Number(q.restaurantId));
      }
      return db
        .prepare(
          `SELECT r.id, r.nom, r.date, r.heure, r.nombre, r.id_restaurant,
                  rest.nom AS restaurant_nom
           FROM reservation r
           JOIN restaurant rest ON rest.id = r.id_restaurant
           ORDER BY r.date DESC, r.heure DESC`,
        )
        .all();
    },
  );

  app.get(
    "/api/admin/restaurants",
    { preHandler: requireAdmin },
    async () => {
      return db
        .prepare(
          `SELECT r.id, r.nom, r.adresse, r.description, r.id_quartier, q.nom AS quartier_nom
           FROM restaurant r JOIN quartier q ON q.id = r.id_quartier
           ORDER BY r.nom`,
        )
        .all();
    },
  );

  app.post(
    "/api/admin/quartiers",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const body = z
        .object({
          nom: z.string().min(3).max(100),
          description: z.string().min(1),
        })
        .safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: "Données invalides" });
      }
      try {
        const result = db
          .prepare("INSERT INTO quartier (nom, description) VALUES (?, ?)")
          .run(body.data.nom, body.data.description);
        return reply.code(201).send({ id: Number(result.lastInsertRowid) });
      } catch {
        return reply.code(409).send({ error: "Quartier déjà existant" });
      }
    },
  );

  app.put<{ Params: { id: string } }>(
    "/api/admin/quartiers/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const body = z
        .object({
          nom: z.string().min(3).max(100),
          description: z.string().min(1),
        })
        .safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: "Données invalides" });
      }
      const result = db
        .prepare("UPDATE quartier SET nom = ?, description = ? WHERE id = ?")
        .run(body.data.nom, body.data.description, Number(request.params.id));
      if (result.changes === 0) {
        return reply.code(404).send({ error: "Quartier introuvable" });
      }
      return { ok: true };
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/api/admin/quartiers/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const id = Number(request.params.id);
      const restos = db
        .prepare("SELECT COUNT(*) AS c FROM restaurant WHERE id_quartier = ?")
        .get(id) as { c: number };
      if (restos.c > 0) {
        return reply
          .code(409)
          .send({ error: "Impossible : des restaurants sont liés à ce quartier" });
      }
      const result = db.prepare("DELETE FROM quartier WHERE id = ?").run(id);
      if (result.changes === 0) {
        return reply.code(404).send({ error: "Quartier introuvable" });
      }
      return { ok: true };
    },
  );

  app.post(
    "/api/admin/restaurants",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const body = z
        .object({
          nom: z.string().min(1).max(100),
          adresse: z.string().min(1),
          description: z.string().min(1),
          id_quartier: z.number().int().positive(),
        })
        .safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: "Données invalides" });
      }
      const q = db
        .prepare("SELECT id FROM quartier WHERE id = ?")
        .get(body.data.id_quartier);
      if (!q) return reply.code(400).send({ error: "Quartier invalide" });
      const result = db
        .prepare(
          "INSERT INTO restaurant (nom, adresse, description, id_quartier) VALUES (?, ?, ?, ?)",
        )
        .run(
          body.data.nom,
          body.data.adresse,
          body.data.description,
          body.data.id_quartier,
        );
      return reply.code(201).send({ id: Number(result.lastInsertRowid) });
    },
  );

  app.put<{ Params: { id: string } }>(
    "/api/admin/restaurants/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const body = z
        .object({
          nom: z.string().min(1).max(100),
          adresse: z.string().min(1),
          description: z.string().min(1),
          id_quartier: z.number().int().positive(),
        })
        .safeParse(request.body);
      if (!body.success) {
        return reply.code(400).send({ error: "Données invalides" });
      }
      const result = db
        .prepare(
          "UPDATE restaurant SET nom = ?, adresse = ?, description = ?, id_quartier = ? WHERE id = ?",
        )
        .run(
          body.data.nom,
          body.data.adresse,
          body.data.description,
          body.data.id_quartier,
          Number(request.params.id),
        );
      if (result.changes === 0) {
        return reply.code(404).send({ error: "Restaurant introuvable" });
      }
      return { ok: true };
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/api/admin/restaurants/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const result = db
        .prepare("DELETE FROM restaurant WHERE id = ?")
        .run(Number(request.params.id));
      if (result.changes === 0) {
        return reply.code(404).send({ error: "Restaurant introuvable" });
      }
      return { ok: true };
    },
  );

  app.get("/api/diplomes", async () => {
    return db.prepare("SELECT id, nom FROM diplome ORDER BY nom").all();
  });
}
