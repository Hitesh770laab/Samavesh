import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Check if Turso environment variables are available
const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let client;

if (tursoUrl && tursoToken) {
  // Use Turso (remote)
  console.log('Using Turso database connection');
  client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  });
} else {
  // Use local SQLite for development
  console.log('Using local SQLite database for development');
  client = createClient({
    url: 'file:local.db',
  });
}

export const db = drizzle(client, { schema });

export type Database = typeof db;