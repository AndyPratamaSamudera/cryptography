import crypto from 'crypto';

export interface RsaKeyPairPem {
  publicKey: string;
  privateKey: string;
}

/** Generate RSA key pair; PEM SPKI (public) and PKCS#8 (private). */
export function generateRsaKeyPairPem(): RsaKeyPairPem {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

/** Encrypt UTF-8 plain text with RSA public key; returns Base64 cipher text. */
export function encryptPlainTextToBase64(plainText: string, publicKeyPem: string): string {
  const cipherBuffer = crypto.publicEncrypt(publicKeyPem, Buffer.from(plainText, 'utf8'));
  return cipherBuffer.toString('base64');
}

/** Decrypt Base64 cipher text with RSA private key; returns UTF-8 plain text. */
export function decryptBase64ToPlainText(cipherTextBase64: string, privateKeyPem: string): string {
  const plainBuffer = crypto.privateDecrypt(
    privateKeyPem,
    Buffer.from(cipherTextBase64.replace(/\s/g, ''), 'base64')
  );
  return plainBuffer.toString('utf8');
}
