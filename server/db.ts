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
  return db.prepare('SELECT * FROM devices WHERE device_id = ?').get(deviceId) as unknown as DeviceRow;
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

/** Credits a rewarded ad. Returns false when the transaction was already processed. */
export function creditAdReward(deviceId: string, transactionId: string): boolean {
  const inserted = db
    .prepare('INSERT OR IGNORE INTO ad_rewards (transaction_id, device_id, rewarded_at) VALUES (?, ?, ?)')
    .run(transactionId, deviceId, new Date().toISOString());
  if (inserted.changes === 0) return false;

  getDevice(deviceId);
  db.prepare('UPDATE devices SET credits = credits + ? WHERE device_id = ?').run(
    CREDITS_PER_AD,
    deviceId
  );
  return true;
}
