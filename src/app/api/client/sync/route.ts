import { NextResponse } from 'next/server';
import { fetchDevice, saveDevice } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { deviceId } = await request.json();
    if (!deviceId) return NextResponse.json({ error: 'Device ID missing' }, { status: 400 });

    const now = Date.now();
    let device = await fetchDevice(deviceId);

    if (!device) {
      // First time we see this device
      device = {
        deviceId,
        firstAccessed: now,
        isBanned: false,
        activeKey: null,
        expiresAt: null
      };
      await saveDevice(device);
    }

    // Check if key is expired
    if (device.activeKey && device.expiresAt && device.expiresAt < now) {
      device.activeKey = null; // expire the key
      await saveDevice(device);
    }

    return NextResponse.json({
      isBanned: device.isBanned,
      firstAccessed: device.firstAccessed,
      hasValidKey: !!device.activeKey && (!device.expiresAt || device.expiresAt > now)
    });
    
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
