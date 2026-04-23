import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoUri);
    
    return NextResponse.json({ 
      message: 'MongoDB connection successful!',
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to MongoDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
