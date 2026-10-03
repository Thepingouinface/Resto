import bcrypt from "bcryptjs";
import { migrate, openDb, resolveDbPath } from "./db.js";

export function seedDatabase(): string {
  const dbPath = resolveDbPath();
  const db = openDb(dbPath);
  migrate(db);

  const count = db.prepare("SELECT COUNT(*) AS c FROM quartier").get() as {
    c: number;
  };
  if (count.c > 0) {
    db.close();
    return dbPath;
  }

  const insertQuartier = db.prepare(
    "INSERT INTO quartier (nom, description) VALUES (?, ?)",
  );
  const insertRestaurant = db.prepare(
    "INSERT INTO restaurant (nom, adresse, description, id_quartier) VALUES (?, ?, ?, ?)",
  );
  const insertDiplome = db.prepare("INSERT INTO diplome (nom) VALUES (?)");
  const insertCuisinier = db.prepare(
    "INSERT INTO cuisinier (nom, salaire, id_restaurant, id_diplome) VALUES (?, ?, ?, ?)",
  );
  const insertUser = db.prepare(
    "INSERT INTO utilisateur (email, password_hash, role) VALUES (?, ?, 'admin')",
  );

  const run = db.transaction(() => {
    insertQuartier.run("Petit Bayonne", "Un quartier assez étroit");
    insertQuartier.run("Grand Bayonne", "Espace, air et liberté");
    insertQuartier.run("Polo-Beyris", "Polo. Le bonbon avec un trou");
    insertQuartier.run("Saint-Esprit", "Le quartier de la gare");

    insertRestaurant.run(
      "Auberge du Petit Bayonne",
      "23 Rue des Cordeliers, 64100 Bayonne",
      "Dans un cadre décontracté avec pierres apparentes, ce restaurant propose une cuisine basque familiale",
      1,
    );
    insertRestaurant.run(
      "La Rotisserie du Roy Léon",
      "8 Rue de Coursic, 64100 Bayonne",
      "Ce restaurant spécialisé en rôtisserie sert une cuisine régionale 7j/7 dans un cadre rustique ou en terrasse.",
      1,
    );
    insertRestaurant.run(
      "Restaurant Le Chistera",
      "42 Rue Port Neuf, 64100 Bayonne",
      "Ce restaurant sert des plats basques comme le jambon piperade dans un cadre rustique avec poutres apparentes.",
      2,
    );
    insertRestaurant.run(
      "Le Bistrot Itsaski",
      "43 Quai Amiral Jaureguiberry, 64100 Bayonne",
      "Restaurant français",
      2,
    );
    insertRestaurant.run(
      "La Grange",
      "26 Quai Galuperie, 64100 Bayonne",
      "Ce restaurant en bordure de rivière sert une cuisine du marché dans un décor rustique aux chaises Louis XIII.",
      1,
    );

    insertDiplome.run("CAP");
    insertDiplome.run("BEP");
    insertDiplome.run("Bac pro");

    const cooks: [string, number, number, number][] = [
      ["Paul Bocuse", 4000, 1, 1],
      ["Pierre Troisgros", 3000, 2, 2],
      ["Michel Guerard", 2000, 3, 3],
      ["Georges Blanc", 1000, 4, 1],
      ["Joel Robuchon", 1500, 5, 2],
      ["Ghislaine Arabian", 2000, 1, 3],
      ["Christian Constant", 2500, 2, 1],
      ["Pierre Gagnaire", 2750, 3, 2],
      ["Bernard Loiseau", 1750, 4, 3],
      ["Guy Savoy", 1250, 5, 1],
      ["Alain Ducasse", 2250, 1, 1],
    ];

    for (const [nom, salaire, idResto, idDiplome] of cooks) {
      insertCuisinier.run(nom, salaire, idResto, idDiplome);
    }

    const email = process.env.ADMIN_EMAIL ?? "admin@bayonne.local";
    const password = process.env.ADMIN_PASSWORD ?? "AdminBayonne2026!";
    insertUser.run(email, bcrypt.hashSync(password, 10));
  });

  run();
  db.close();
  return dbPath;
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("seed.ts") || process.argv[1].endsWith("seed.js"));

if (isMain) {
  const { config } = await import("dotenv");
  const nodePath = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const root = nodePath.resolve(
    nodePath.dirname(fileURLToPath(import.meta.url)),
    "../../..",
  );
  config({ path: nodePath.join(root, ".env") });
  const dbPath = seedDatabase();
  console.log(`Seed OK → ${dbPath}`);
}
