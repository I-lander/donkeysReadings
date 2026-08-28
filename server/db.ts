import { DatabaseSync } from 'node:sqlite';

const FREE_READINGS_PER_DAY = Number(process.env.FREE_READINGS_PER_DAY ?? 3);
const CREDITS_PER_AD = Number(process.env.CREDITS_PER_AD ?? 1);

const db = new DatabaseSync(process.env.DB_PATH ?? 'donkeys.db');
db.exec('PRAGMA journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS devices (
    device_id TEXT PRIMARY KEY,
    credits INTEGER NOT NULL DEFAULT 0,
    free_used_on TEXT NOT NULL DEFAULT '',
    free_count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS ad_rewards (
    transaction_id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    rewarded_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    question TEXT NOT NULL,
    question_norm TEXT NOT NULL,
    lang TEXT NOT NULL,
    cards TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_readings_device ON readings (device_id, id);
`);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface DeviceRow {
  device_id: string;
  credits: number;
  free_used_on: string;
  free_count: number;
}

function getDevice(deviceId: string): DeviceRow {
  db.prepare('INSERT OR IGNORE INTO devices (device_id) VALUES (?)').run(deviceId);
  return db
    .prepare('SELECT * FROM devices WHERE device_id = ?')
    .get(deviceId) as unknown as DeviceRow;
}

export interface Quota {
  freeRemaining: number;
  credits: number;
}

export function getQuota(deviceId: string): Quota {
  const device = getDevice(deviceId);
  const freeUsed = device.free_used_on === today() ? device.free_count : 0;
  return {
    freeRemaining: Math.max(0, FREE_READINGS_PER_DAY - freeUsed),
    credits: device.credits,
  };
}

/** Consumes one reading (free first, then credits). Returns false when nothing is left. */
export function consumeReading(deviceId: string): boolean {
  const device = getDevice(deviceId);
  const isToday = device.free_used_on === today();
  const freeUsed = isToday ? device.free_count : 0;

  if (freeUsed < FREE_READINGS_PER_DAY) {
    db.prepare('UPDATE devices SET free_used_on = ?, free_count = ? WHERE device_id = ?').run(
      today(),
      freeUsed + 1,
      deviceId
    );
    return true;
  }

  const updated = db
    .prepare('UPDATE devices SET credits = credits - 1 WHERE device_id = ? AND credits > 0')
    .run(deviceId);
  return updated.changes > 0;
}

export interface ReadingRow {
  question: string;
  lang: string;
  cards: string;
  result: string;
  created_at: string;
}

/** Normalizes a question so that trivially different phrasings match (case, spacing). */
export function normalizeQuestion(question: string): string {
  return question.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Returns the stored reading for the exact same question (normalized) and language, if any. */
export function findReadingByQuestion(
  deviceId: string,
  question: string,
  lang: string
): ReadingRow | undefined {
  return db
    .prepare(
      'SELECT question, lang, cards, result, created_at FROM readings WHERE device_id = ? AND question_norm = ? AND lang = ? ORDER BY id DESC LIMIT 1'
    )
    .get(deviceId, normalizeQuestion(question), lang) as unknown as ReadingRow | undefined;
}

/** Returns the most recent readings of a device, newest first. */
export function getReadingHistory(deviceId: string, limit = 3): ReadingRow[] {
  return db
    .prepare(
      'SELECT question, lang, cards, result, created_at FROM readings WHERE device_id = ? ORDER BY id DESC LIMIT ?'
    )
    .all(deviceId, limit) as unknown as ReadingRow[];
}

export function saveReading(
  deviceId: string,
  question: string,
  lang: string,
  cards: string,
  result: string
): void {
  db.prepare(
    'INSERT INTO readings (device_id, question, question_norm, lang, cards, result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    deviceId,
    question,
    normalizeQuestion(question),
    lang,
    cards,
    result,
    new Date().toISOString()
  );
}

/**
 * Moves what a device accumulated to a Google account (called at sign-in).
 * History moves, credits are transferred (then zeroed on the device), and the
 * account's free usage for today takes the highest of the two counts. The device
 * row keeps its own free counter, so a sign-in/sign-out cycle cannot reset the
 * daily quota in either direction. Idempotent.
 */
export function mergeIdentity(fromId: string, toId: string): void {
  if (fromId === toId) return;

  db.prepare('UPDATE readings SET device_id = ? WHERE device_id = ?').run(toId, fromId);

  const from = db.prepare('SELECT * FROM devices WHERE device_id = ?').get(fromId) as unknown as
    DeviceRow | undefined;
  if (!from) return;

  const to = getDevice(toId);
  const todayStr = today();
  const fromFree = from.free_used_on === todayStr ? from.free_count : 0;
  const toFree = to.free_used_on === todayStr ? to.free_count : 0;
  db.prepare(
    'UPDATE devices SET credits = credits + ?, free_used_on = ?, free_count = ? WHERE device_id = ?'
  ).run(from.credits, todayStr, Math.max(fromFree, toFree), toId);
  db.prepare('UPDATE devices SET credits = 0 WHERE device_id = ?').run(fromId);
}

/** Credits a rewarded ad. Returns false when the transaction was already processed. */
export function creditAdReward(deviceId: string, transactionId: string): boolean {
  const inserted = db
    .prepare(
      'INSERT OR IGNORE INTO ad_rewards (transaction_id, device_id, rewarded_at) VALUES (?, ?, ?)'
    )
    .run(transactionId, deviceId, new Date().toISOString());
  if (inserted.changes === 0) return false;

  getDevice(deviceId);
  db.prepare('UPDATE devices SET credits = credits + ? WHERE device_id = ?').run(
    CREDITS_PER_AD,
    deviceId
  );
  return true;
}
