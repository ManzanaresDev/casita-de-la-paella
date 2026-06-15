// db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// neon() crée un client HTTP léger, idéal pour le serverless.
// Chaque requête est une simple requête HTTPS vers l'API Neon —
// pas de connexion persistante, pas de pool à gérer.
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
