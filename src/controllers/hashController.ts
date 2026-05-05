import type { Request, Response } from 'express';
import { digestUtf8Text } from '../utils/hashCrypto';
import { sendJsonError } from '../utils/jsonResponse';
import { isNonEmptyString, parseHashAlgorithm, supportedHashAlgorithms } from '../utils/validation';

/** POST /api/hash — body: { plainText, algorithm } */
export function postHash(req: Request, res: Response): void {
  const plainText = req.body?.plainText;
  const algorithmRaw = req.body?.algorithm;

  if (!isNonEmptyString(plainText)) {
    sendJsonError(res, 400, 'Input text is required.');
    return;
  }

  const algorithm = parseHashAlgorithm(algorithmRaw);
  if (!algorithm) {
    sendJsonError(
      res,
      400,
      `algorithm must be one of: ${supportedHashAlgorithms.join(', ')}.`
    );
    return;
  }

  try {
    const hashHex = digestUtf8Text(plainText, algorithm);
    res.json({
      success: true,
      data: {
        hashHex,
        algorithm,
        inputEncoding: 'utf8',
        outputEncoding: 'hex',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Hash generation failed.';
    sendJsonError(res, 500, message);
  }
}
