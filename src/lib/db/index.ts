/**
 * FitMeal Database Client
 *
 * Drizzle ORM client for Neon PostgreSQL
 * Falls back gracefully when DATABASE_URL is not set
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Check if DATABASE_URL is available
const DATABASE_URL = process.env.DATABASE_URL;

// Create database client only if DATABASE_URL is set
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (DATABASE_URL) {
  const sql = neon(DATABASE_URL);
  db = drizzle(sql, { schema });
}

// Export a proxy that throws helpful errors when db is not available
export { db };

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return db !== null;
}

// Export schema for use in queries
export * from './schema';
export * from './types';
