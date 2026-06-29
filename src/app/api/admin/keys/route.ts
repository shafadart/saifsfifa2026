import { NextResponse } from 'next/server';
import { fetchKeys, saveKey } from '@/lib/db';

const isAuthenticated = (req: Request) => {
  const token = req.headers.get('Authorization');
  return token === `Bearer ${process.env.ADMIN_SECRET_TOKEN}`;
};

export async function GET(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const keys = await fetchKeys();
    return NextResponse.json({ keys });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    // Generate unique key VIP-XXXX-XXXX
    const randomStr = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKeyId = `VIP-${randomStr()}-${randomStr()}`;
    
    const newKey = {
      keyId: newKeyId,
      status: 'unused' as const,
      generatedAt: Date.now(),
      usedByDeviceId: null,
      expiresAt: null
    };
    
    await saveKey(newKey);
    return NextResponse.json({ success: true, key: newKey });
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
