import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type JwtUser = { id: number; email: string; role: string };

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
    const user = request.user as JwtUser;
    if (user.role !== "admin") {
      reply.code(403).send({ error: "Accès admin requis" });
    }
  } catch {
    reply.code(401).send({ error: "Authentification requise" });
  }
}

export function registerAuthHooks(app: FastifyInstance): void {
  app.decorate("authenticate", requireAdmin);
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtUser;
    user: JwtUser;
  }
}
