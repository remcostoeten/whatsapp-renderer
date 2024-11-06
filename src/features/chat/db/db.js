/**
 * This module sets up the database connection using drizzle-orm and Neon for PostgreSQL.
 * It is intended for seeding the database with initial data.
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Pool } from '@neondatabase/serverless';

const databaseConfig = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    SCHEMA: process.env.SCHEMA || '',
    MESSAGES: process.env.MESSAGES || '',
    FAVORITES: process.env.FAVORITES || ''
};

let sql;
let db;
let pool;

if (typeof window === 'undefined') {
    sql = neon(databaseConfig.DATABASE_URL);
    db = drizzle(sql, {
        schema: {
            messages: databaseConfig.MESSAGES,
            favorites: databaseConfig.FAVORITES
        }
    });
    pool = new Pool({ connectionString: databaseConfig.DATABASE_URL });
}

export { db, pool, sql };