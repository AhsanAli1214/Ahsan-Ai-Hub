import { NextResponse } from 'next/server';

export async function GET() {
  try {
    throw new Error('This is a test error from the server API');
  } catch (error) {
    return NextResponse.json(
      { error: 'Test server error triggered' },
      { status: 500 }
    );
  }
}
