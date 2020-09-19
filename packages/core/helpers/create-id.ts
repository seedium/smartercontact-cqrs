import * as crypto from 'crypto';

export const createId = (prefix: string, length = 20): string => {
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let random = '';
  const buf = new Uint8Array(length);
  const randomValues = Array.from(crypto.randomBytes(buf.length));
  randomValues.forEach((v) => (random += charset[v % charset.length]));
  return prefix + random;
};
