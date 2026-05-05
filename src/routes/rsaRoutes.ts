import { Router } from 'express';
import { postDecrypt, postEncrypt, postGenerateKeyPair } from '../controllers/rsaController';

const router = Router();

router.post('/generate-key-pair', postGenerateKeyPair);
router.post('/encrypt', postEncrypt);
router.post('/decrypt', postDecrypt);

export default router;
