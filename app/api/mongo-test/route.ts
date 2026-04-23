import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Hardcode the MongoDB URI temporarily for testing
    const mongoUri = "mongodb+srv://mkrabbanicse_db_user:nobinislam420%40%23%24@cluster0.g2korqj.mongodb.net/?appName=Cluster0";
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const dbInfo = {
      message: 'MongoDB connection successful!',
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    await mongoose.disconnect();
    
    return NextResponse.json(dbInfo);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to MongoDB',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
