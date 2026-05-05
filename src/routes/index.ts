import type { Express } from 'express';
import { Router } from 'express';
import { getHashPage, getRsaPage } from '../controllers/pageController';
import hashRoutes from './hashRoutes';
import rsaRoutes from './rsaRoutes';

const router = Router();

router.get('/', (_req, res) => {
  res.redirect('/rsa');
});

router.get('/rsa', getRsaPage);
router.get('/hash', getHashPage);

router.use('/api/rsa', rsaRoutes);
router.use('/api/hash', hashRoutes);

export function registerRoutes(app: Express): void {
  app.use(router);
}
