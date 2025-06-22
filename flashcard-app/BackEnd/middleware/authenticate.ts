// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../src/auth'; // your auth.ts path

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Add userId to the request object
  (req as any).userId = userId;
  next();
}
