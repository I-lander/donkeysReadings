const KEY = 'dr_streak';

interface StreakData {
  day: string;
  count: number;
}

function read(): StreakData {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '') as StreakData;
  } catch {
    return { day: '', count: 0 };
  }
}

/** Call after a successful reading; returns the up-to-date streak. */
export function bumpStreak(): number {
  const today = new Date().toISOString().slice(0, 10);
  const data = read();
  if (data.day === today) return data.count;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const count = data.day === yesterday ? data.count + 1 : 1;
  localStorage.setItem(KEY, JSON.stringify({ day: today, count }));
  return count;
}

export function currentStreak(): number {
  return read().count;
}
