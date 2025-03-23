import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

const client = new Database("local.db");
export const db = drizzle({ client });
