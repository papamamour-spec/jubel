import { Pool, QueryResultRow } from "pg";

let pool: Pool | null = null;
let schema: Promise<void> | null = null;

export function dbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.DATABASE_SSL === "false" ? undefined : { rejectUnauthorized: false },
    });
  }
  return pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS visites (
  jour date NOT NULL,
  chemin text NOT NULL,
  vues integer NOT NULL DEFAULT 0,
  PRIMARY KEY (jour, chemin)
);
CREATE TABLE IF NOT EXISTS visites_uniques (
  jour date NOT NULL,
  empreinte text NOT NULL,
  chemin text NOT NULL,
  PRIMARY KEY (jour, empreinte, chemin)
);
CREATE TABLE IF NOT EXISTS commentaires (
  id serial PRIMARY KEY,
  slug text NOT NULL,
  pseudo text NOT NULL,
  email text,
  texte text NOT NULL,
  statut text NOT NULL DEFAULT 'en_attente',
  motif text,
  empreinte text,
  signalements integer NOT NULL DEFAULT 0,
  cree_le timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS commentaires_slug_idx ON commentaires (slug, statut, cree_le);
CREATE INDEX IF NOT EXISTS commentaires_empreinte_idx ON commentaires (empreinte, cree_le);
CREATE TABLE IF NOT EXISTS contributions (
  id serial PRIMARY KEY,
  nom text NOT NULL,
  email text,
  titre text NOT NULL,
  texte text NOT NULL,
  statut text NOT NULL DEFAULT 'recue',
  motif text,
  empreinte text,
  cree_le timestamptz NOT NULL DEFAULT now(),
  publie_le timestamptz
);
CREATE INDEX IF NOT EXISTS contributions_statut_idx ON contributions (statut, publie_le);
`;

async function ensureSchema(): Promise<void> {
  if (!schema) {
    schema = getPool()
      .query(SCHEMA)
      .then(() => undefined)
      .catch((err) => {
        schema = null;
        throw err;
      });
  }
  return schema;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!dbEnabled()) throw new Error("DATABASE_URL is not set");
  await ensureSchema();
  const result = await getPool().query<T>(text, params);
  return result.rows;
}
