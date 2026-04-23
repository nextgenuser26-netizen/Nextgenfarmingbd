import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic API functionality without MongoDB first
    return NextResponse.json({ 
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'API failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
