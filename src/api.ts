import type { Card } from './constants/cards';
import { getDeviceId } from './deviceId';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export class QuotaExhaustedError extends Error {
  constructor() {
    super('No readings left today');
    this.name = 'QuotaExhaustedError';
  }
}

export interface Quota {
  freeRemaining: number;
  credits: number;
}

export async function generateReading(
  question: string,
  cards: Card[],
  lang: string
): Promise<string> {
  const response = await fetch(`${API_URL}/api/generateReading`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Id': getDeviceId(),
    },
    body: JSON.stringify({ question, cards, lang }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 429 && data.error?.code === 'quota_exhausted') {
      throw new QuotaExhaustedError();
    }
    throw new Error(data.error?.message ?? `Request failed with status ${response.status}`);
  }
  return data.result;
}

export async function fetchQuota(): Promise<Quota> {
  const response = await fetch(`${API_URL}/api/quota`, {
    headers: { 'X-Device-Id': getDeviceId() },
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

/** Polls the quota until a rewarded-ad credit lands (SSV callback is asynchronous). */
export async function waitForCredit(maxTries = 10, delayMs = 1500): Promise<boolean> {
  for (let i = 0; i < maxTries; i++) {
    try {
      const quota = await fetchQuota();
      if (quota.credits > 0 || quota.freeRemaining > 0) return true;
    } catch {
      // transient error: keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}
