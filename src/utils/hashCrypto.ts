import crypto from 'crypto';
import type { SupportedHashAlgorithm } from './validation';

/** Map UI / API values to Node crypto algorithm names. */
const nodeAlgorithmById: Record<SupportedHashAlgorithm, string> = {
  sha256: 'sha256',
  sha512: 'sha512',
  md5: 'md5',
};

/** Produce hexadecimal digest of UTF-8 input. */
export function digestUtf8Text(plainText: string, algorithm: SupportedHashAlgorithm): string {
  const nodeName = nodeAlgorithmById[algorithm];
  return crypto.createHash(nodeName).update(plainText, 'utf8').digest('hex');
}
