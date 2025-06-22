import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, verifyPassword, generateToken } from './auth';

export async function registerUser(username: string, password: string): Promise<string> {
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) throw new Error('User already exists');

  const id = uuidv4();
  const passwordHash = await hashPassword(password);

  db.prepare('INSERT INTO users (id, username, passwordHash) VALUES (?, ?, ?)').run(id, username, passwordHash);
  return id;
}

export async function loginUser(username: string, password: string): Promise<string | null> {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return null;

  const match = await verifyPassword(password, user.passwordHash);
  if (!match) return null;

  return generateToken(user.id);
}
