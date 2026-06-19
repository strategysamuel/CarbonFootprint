import { NextResponse } from 'next/server';

// Simple health check endpoint used by Docker HEALTHCHECK and Cloud Run
export async function GET() {
  return NextResponse.json(
    {
      status:    'ok',
      service:   'carbon-mirror',
      timestamp: new Date().toISOString(),
      version:   process.env.npm_package_version ?? '1.0.0',
    },
    { status: 200 }
  );
}
