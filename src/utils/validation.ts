/** Shared validation helpers for API inputs. */

const RSA_MODULUS_BITS = 2048;
/** PKCS#1 v1.5 padding overhead for RSA encryption. */
const RSA_PKCS1_PADDING_OVERHEAD = 11;
const maxRsaPlainTextBytes = RSA_MODULUS_BITS / 8 - RSA_PKCS1_PADDING_OVERHEAD;

export const supportedHashAlgorithms = ['sha256', 'sha512', 'md5'] as const;
export type SupportedHashAlgorithm = (typeof supportedHashAlgorithms)[number];

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validatePlainTextForRsa(plainText: string): string | null {
  if (!isNonEmptyString(plainText)) {
    return 'Plain text is required.';
  }
  const byteLength = Buffer.byteLength(plainText, 'utf8');
  if (byteLength > maxRsaPlainTextBytes) {
    return `Plain text is too long for RSA (${RSA_MODULUS_BITS}-bit key). Maximum UTF-8 length is ${maxRsaPlainTextBytes} bytes (yours: ${byteLength}).`;
  }
  return null;
}

export function validatePemPublicKey(publicKey: string): string | null {
  if (!isNonEmptyString(publicKey)) {
    return 'Public key is required.';
  }
  if (!publicKey.includes('BEGIN PUBLIC KEY')) {
    return 'Public key must be PEM (SPKI) format.';
  }
  return null;
}

export function validatePemPrivateKey(privateKey: string): string | null {
  if (!isNonEmptyString(privateKey)) {
    return 'Private key is required.';
  }
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    return 'Private key must be PEM (PKCS#8) format.';
  }
  return null;
}

export function validateCipherTextBase64(cipherText: string): string | null {
  if (!isNonEmptyString(cipherText)) {
    return 'Cipher text (Base64) is required.';
  }
  const normalized = cipherText.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]+=*$/.test(normalized)) {
    return 'Cipher text must be valid Base64.';
  }
  return null;
}

export function parseHashAlgorithm(value: unknown): SupportedHashAlgorithm | null {
  if (typeof value !== 'string') {
    return null;
  }
  const lower = value.toLowerCase();
  if ((supportedHashAlgorithms as readonly string[]).includes(lower)) {
    return lower as SupportedHashAlgorithm;
  }
  return null;
}
