import crypto from 'node:crypto';

// AdMob rewarded ad Server-Side Verification.
// https://developers.google.com/admob/android/ssv
// The signed message is the raw query string up to (excluding) "&signature=".

const KEYS_URL = 'https://www.gstatic.com/admob/reward/verifier-keys.json';
const KEYS_TTL_MS = 24 * 60 * 60 * 1000;

interface VerifierKey {
  keyId: number;
  pem: string;
}

let cachedKeys: VerifierKey[] = [];
let cachedAt = 0;

async function getKeys(): Promise<VerifierKey[]> {
  if (cachedKeys.length > 0 && Date.now() - cachedAt < KEYS_TTL_MS) {
    return cachedKeys;
  }
  const response = await fetch(KEYS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch AdMob verifier keys: ${response.status}`);
  }
  const data = (await response.json()) as { keys: VerifierKey[] };
  cachedKeys = data.keys;
  cachedAt = Date.now();
  return cachedKeys;
}

export async function verifySsvSignature(rawQuery: string): Promise<boolean> {
  const signatureIndex = rawQuery.indexOf('&signature=');
  if (signatureIndex < 0) return false;
  const message = rawQuery.substring(0, signatureIndex);

  const params = new URLSearchParams(rawQuery.substring(signatureIndex + 1));
  const signature = params.get('signature');
  const keyId = Number(params.get('key_id'));
  if (!signature || !Number.isFinite(keyId)) return false;

  const keys = await getKeys();
  const key = keys.find((k) => k.keyId === keyId);
  if (!key) return false;

  const verifier = crypto.createVerify('sha256');
  verifier.update(message);
  return verifier.verify(key.pem, Buffer.from(signature, 'base64url'));
}
