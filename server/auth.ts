// Google ID token verification through Google's public tokeninfo endpoint.
// No SDK dependency; verified tokens are cached in memory until they expire.

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';

export interface GoogleIdentity {
  sub: string;
  email?: string;
}

interface CacheEntry {
  identity: GoogleIdentity;
  expiresAt: number;
}

const tokenCache = new Map<string, CacheEntry>();

export function authEnabled(): boolean {
  return GOOGLE_CLIENT_ID.length > 0;
}

/** Stable per-account storage key, kept distinct from raw device ids. */
export function googleUserKey(sub: string): string {
  return `google:${sub}`;
}

/** Returns the token's identity, or undefined when the token is invalid or expired. */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity | undefined> {
  if (!authEnabled()) return undefined;

  const cached = tokenCache.get(idToken);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.identity;
  }

  let payload: { aud?: string; sub?: string; email?: string; exp?: string };
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!response.ok) return undefined;
    payload = (await response.json()) as typeof payload;
  } catch (error) {
    console.error(`Google tokeninfo request failed: ${(error as Error).message}`);
    return undefined;
  }

  if (payload.aud !== GOOGLE_CLIENT_ID || !payload.sub) return undefined;

  const expiresAt = Number(payload.exp ?? 0) * 1000;
  if (expiresAt <= Date.now()) return undefined;

  if (tokenCache.size > 1000) {
    for (const [key, entry] of tokenCache) {
      if (entry.expiresAt <= Date.now()) tokenCache.delete(key);
    }
  }

  const identity: GoogleIdentity = { sub: payload.sub, email: payload.email };
  tokenCache.set(idToken, { identity, expiresAt });
  return identity;
}
