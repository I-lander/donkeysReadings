import type { Card } from './constants/cards';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function generateReading(
  question: string,
  cards: Card[],
  lang: string
): Promise<string> {
  const response = await fetch(`${API_URL}/api/generateReading`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, cards, lang }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? `Request failed with status ${response.status}`);
  }
  return data.result;
}
