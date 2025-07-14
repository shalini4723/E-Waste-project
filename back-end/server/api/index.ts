// api/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../api';

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as any, res as any);
}
