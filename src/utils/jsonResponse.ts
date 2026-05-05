import type { Response } from 'express';

/** Standard error payload for JSON API routes. */
export function sendJsonError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, error: message });
}
