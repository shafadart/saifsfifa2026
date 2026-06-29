import { NextResponse } from 'next/server';
import { fetchDevice, saveDevice, fetchKey, saveKey } from '@/lib/db';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const { deviceId, key } = await request.json();
    if (!deviceId || !key) {
      return NextResponse.json({ error: 'Missing deviceId or key' }, { status: 400 });
    }

    const now = Date.now();

    // Find the device
    const device = await fetchDevice(deviceId);
    if (!device) {
      return NextResponse.json({ error: 'Device not synced' }, { status: 400 });
    }

    if (device.isBanned) {
      return NextResponse.json({ error: 'Device is banned' }, { status: 403 });
    }

    // Find the key
    const dbKey = await fetchKey(key);
    if (!dbKey) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 404 });
    }

    if (dbKey.status === 'used') {
      return NextResponse.json({ error: 'Key has already been used' }, { status: 400 });
    }

    // Activate the key for this device
    dbKey.status = 'used';
    dbKey.usedByDeviceId = deviceId;
    dbKey.expiresAt = now + SEVEN_DAYS_MS;

    device.activeKey = key;
    device.expiresAt = now + SEVEN_DAYS_MS;

    // Save both to db
    await saveKey(dbKey);
    await saveDevice(device);

    return NextResponse.json({ success: true, expiresAt: device.expiresAt });

  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
