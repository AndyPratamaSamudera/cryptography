import type { Request, Response } from 'express';

export function getRsaPage(_req: Request, res: Response): void {
  res.render('rsa', { title: 'RSA', activePage: 'rsa' });
}

export function getHashPage(_req: Request, res: Response): void {
  res.render('hash', { title: 'Hash', activePage: 'hash' });
}
