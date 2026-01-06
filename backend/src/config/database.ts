// =====================================================
// Database Configuration (COMMENTED OUT FOR DEVELOPMENT)
// =====================================================
// Uncomment when PostgreSQL is ready

/*
import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'stackoverflow_engine',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);
*/

// Mock pool for development (no actual DB connection)
export const pool = null;

// Helper to convert snake_case to camelCase
export function toCamelCase<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = row[key];
  }
  return result as T;
}

// Helper to convert camelCase to snake_case for SQL
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Test connection - always returns true in mock mode
export async function testConnection(): Promise<boolean> {
  console.log('📦 Running in MOCK DATA mode (PostgreSQL disabled)');
  console.log('   To enable PostgreSQL, uncomment the pool configuration in database.ts');
  return true;
}
