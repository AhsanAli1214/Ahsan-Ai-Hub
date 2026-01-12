import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { deviceId, deviceType, identifier } = await request.json();
    const appId = "8a693786-f992-42d3-adfb-56a230adcea5";
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!apiKey) {
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
        device_type: deviceType || 11, // 11 is for Huawei or generic web, but usually handled by SDK. 
        // For server API, 11 is "Huawei", 1 is "iOS", 0 is "Android".
        // However, the documentation for "add-a-device" uses integers. 
        // 5 is Windows/Chrome/Firefox/Safari.
        identifier: identifier,
        // For PWA, we might want to tag it
        tags: { pwa: 'true' }
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
