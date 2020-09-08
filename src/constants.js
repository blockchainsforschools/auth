import { randomBytes } from 'crypto';
import { resolve } from 'path';

export const COOKIE_SECRET = process.env.COOKIE_SECRET || randomBytes(32).toString('hex');

export const PORT = Number(process.env.PORT) || 3001;

export const DATABASE_URL = process.env.DATABASE_URL || `sqlite::${resolve(__dirname, 'app.db')}`;

export const NODE_ENV = process.env.NODE_ENV || 'development';
