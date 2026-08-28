import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// OAuth *web* client ID from the Google Cloud console. Empty = feature disabled.
const CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
const STORAGE_KEY = 'donkeys-google-session';

export interface AuthSession {
  idToken: string;
  email: string;
  /** Server-side identity key (google:<sub>); also used as the AdMob SSV user id. */
  userId: string;
}

let session: AuthSession | undefined = loadSession();
let initialized = false;

function loadSession(): AuthSession | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthSession) : undefined;
  } catch {
    return undefined;
  }
}

export function authAvailable(): boolean {
  return CLIENT_ID.length > 0;
}

export function getSession(): AuthSession | undefined {
  return session;
}

export function setSession(next: AuthSession): void {
  session = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // keep the in-memory session for this run
  }
}

export function clearSession(): void {
  session = undefined;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing stored
  }
}

export async function initAuth(): Promise<void> {
  if (!authAvailable() || initialized) return;
  await GoogleAuth.initialize({
    clientId: CLIENT_ID,
    scopes: ['profile', 'email'],
    grantOfflineAccess: false,
  });
  initialized = true;
}

export async function googleSignIn(): Promise<{ idToken: string; email: string }> {
  await initAuth();
  const user = await GoogleAuth.signIn();
  return { idToken: user.authentication.idToken, email: user.email };
}

export async function googleSignOut(): Promise<void> {
  clearSession();
  try {
    await GoogleAuth.signOut();
  } catch {
    // already signed out on the Google side
  }
}

/** Refreshes the ID token after expiry. Returns false when a new sign-in is required. */
export async function refreshIdToken(): Promise<boolean> {
  if (!session) return false;
  try {
    await initAuth();
    const authentication = await GoogleAuth.refresh();
    if (!authentication.idToken) return false;
    setSession({ ...session, idToken: authentication.idToken });
    return true;
  } catch {
    return false;
  }
}
