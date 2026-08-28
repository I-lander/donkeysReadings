const STORAGE_KEY = 'donkeys-device-id';

export function getDeviceId(): string {
  let deviceId: string | null = null;
  try {
    deviceId = localStorage.getItem(STORAGE_KEY);
  } catch {
    // storage unavailable: fall through to a per-session id
  }
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    try {
      localStorage.setItem(STORAGE_KEY, deviceId);
    } catch {
      // keep the in-memory id for this session
    }
  }
  return deviceId;
}
