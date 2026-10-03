import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function repoRoot(): string {
  return path.resolve(__dirname, "../../..");
}

export function resolveDbPath(): string {
  const fromEnv = process.env.DATABASE_PATH;
  if (fromEnv) {
    return path.isAbsolute(fromEnv)
      ? fromEnv
      : path.resolve(repoRoot(), fromEnv);
  }
  return path.resolve(__dirname, "../data/bayonne.db");
}

export function openDb(dbPath = resolveDbPath()): Database.Database {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quartier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL UNIQUE CHECK(length(nom) >= 3),
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS restaurant (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL CHECK(length(nom) >= 1),
      adresse TEXT NOT NULL,
      description TEXT NOT NULL,
      id_quartier INTEGER NOT NULL REFERENCES quartier(id)
    );

    CREATE TABLE IF NOT EXISTS diplome (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL CHECK(length(nom) >= 1)
    );

    CREATE TABLE IF NOT EXISTS cuisinier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL CHECK(length(nom) >= 1),
      salaire REAL NOT NULL,
      id_restaurant INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
      id_diplome INTEGER NOT NULL REFERENCES diplome(id)
    );

    CREATE TABLE IF NOT EXISTS reservation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL CHECK(length(nom) >= 1),
      date TEXT NOT NULL,
      heure TEXT NOT NULL,
      nombre INTEGER NOT NULL CHECK(nombre >= 1),
      id_restaurant INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS utilisateur (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin'
    );
  `);
}
