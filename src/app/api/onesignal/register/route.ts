import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { deviceId, deviceType, identifier } = await request.json();
    const appId = "8a693786-f992-42d3-adfb-56a230adcea5";
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!apiKey) {
      console.error('OneSignal API key not configured in environment variables');
      return NextResponse.json({ error: 'OneSignal API key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://onesignal.com/api/v1/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        device_type: deviceType || 5, // 5 is Chrome/Web
        identifier: identifier,
        tags: { pwa: 'true', pwa_app: 'true' }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OneSignal API Error:', data);
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
