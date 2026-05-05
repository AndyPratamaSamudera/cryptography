import { Router } from 'express';
import { postHash } from '../controllers/hashController';

const router = Router();

router.post('/', postHash);

export default router;
