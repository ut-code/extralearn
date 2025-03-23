import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema.ts";

const client = new Database("local.db");
export const db = drizzle({ client, schema });
