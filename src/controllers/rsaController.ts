import type { Request, Response } from 'express';
import { sendJsonError } from '../utils/jsonResponse';
import {
  decryptBase64ToPlainText,
  encryptPlainTextToBase64,
  generateRsaKeyPairPem,
} from '../utils/rsaCrypto';
import {
  validateCipherTextBase64,
  validatePemPrivateKey,
  validatePemPublicKey,
  validatePlainTextForRsa,
} from '../utils/validation';

/** POST /api/rsa/generate-key-pair */
export function postGenerateKeyPair(_req: Request, res: Response): void {
  try {
    const keyPair = generateRsaKeyPairPem();
    res.json({
      success: true,
      data: {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        encodingNote: 'Keys are PEM (UTF-8 text). Cipher text uses Base64; plain text uses UTF-8.',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Key generation failed.';
    sendJsonError(res, 500, message);
  }
}

/** POST /api/rsa/encrypt — body: { plainText, publicKey } */
export function postEncrypt(req: Request, res: Response): void {
  const plainText = req.body?.plainText;
  const publicKey = req.body?.publicKey;

  if (typeof plainText !== 'string') {
    sendJsonError(res, 400, 'plainText must be a string.');
    return;
  }
  if (typeof publicKey !== 'string') {
    sendJsonError(res, 400, 'publicKey must be a string.');
    return;
  }

  const plainErr = validatePlainTextForRsa(plainText);
  if (plainErr) {
    sendJsonError(res, 400, plainErr);
    return;
  }
  const keyErr = validatePemPublicKey(publicKey);
  if (keyErr) {
    sendJsonError(res, 400, keyErr);
    return;
  }

  try {
    const cipherTextBase64 = encryptPlainTextToBase64(plainText, publicKey);
    res.json({
      success: true,
      data: {
        cipherTextBase64,
        plainTextEncoding: 'utf8',
        cipherTextEncoding: 'base64',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Encryption failed.';
    sendJsonError(res, 400, message);
  }
}

/** POST /api/rsa/decrypt — body: { cipherTextBase64, privateKey } */
export function postDecrypt(req: Request, res: Response): void {
  const cipherTextBase64 = req.body?.cipherTextBase64;
  const privateKey = req.body?.privateKey;

  if (typeof cipherTextBase64 !== 'string') {
    sendJsonError(res, 400, 'cipherTextBase64 must be a string.');
    return;
  }
  if (typeof privateKey !== 'string') {
    sendJsonError(res, 400, 'privateKey must be a string.');
    return;
  }

  const cipherErr = validateCipherTextBase64(cipherTextBase64);
  if (cipherErr) {
    sendJsonError(res, 400, cipherErr);
    return;
  }
  const keyErr = validatePemPrivateKey(privateKey);
  if (keyErr) {
    sendJsonError(res, 400, keyErr);
    return;
  }

  try {
    const plainText = decryptBase64ToPlainText(cipherTextBase64, privateKey);
    res.json({
      success: true,
      data: {
        plainText,
        cipherTextEncoding: 'base64',
        plainTextEncoding: 'utf8',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Decryption failed.';
    sendJsonError(res, 400, message);
  }
}
