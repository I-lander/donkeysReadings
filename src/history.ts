export interface HistoryEntry {
  q: string;
  cardImgs: string[];
  result: string;
  date: string; // ISO
}

const KEY = 'dr_history';

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistory(entry: HistoryEntry): HistoryEntry[] {
  const list = [entry, ...loadHistory().filter((h) => h.q !== entry.q)].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export function formatHistoryDate(iso: string, lang: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `${lang === 'fr' ? "Aujourd'hui" : 'Today'} · ${time}`;
  return `${d.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'short' })} · ${time}`;
}
