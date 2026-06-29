import { NextResponse } from 'next/server';
import { fetchDevices, fetchDevice, saveDevice } from '@/lib/db';

const isAuthenticated = (req: Request) => {
  const token = req.headers.get('Authorization');
  return token === `Bearer ${process.env.ADMIN_SECRET_TOKEN}`;
};

export async function GET(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const devices = await fetchDevices();
    return NextResponse.json({ devices });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const { deviceId, action } = await request.json();
    if (!deviceId || (action !== 'ban' && action !== 'unban')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const device = await fetchDevice(deviceId);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    device.isBanned = (action === 'ban');
    await saveDevice(device);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
