import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LandingPage from '@/lib/models/LandingPage';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;
    const landingPage = await LandingPage.findById(id);
    
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json({ landingPage });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json({ error: 'Failed to fetch landing page' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;
    const landingPageData = await request.json();
    
    // Set publishedAt if status is being changed to published
    if (landingPageData.status === 'published') {
      const existing = await LandingPage.findById(id);
      if (existing && existing.status !== 'published') {
        landingPageData.publishedAt = new Date();
      }
    }
    
    const landingPage = await LandingPage.findByIdAndUpdate(
      id,
      landingPageData,
      { new: true, runValidators: true }
    );
    
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json({ landingPage });
  } catch (error: any) {
    console.error('Error updating landing page:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update landing page' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;
    const landingPage = await LandingPage.findByIdAndDelete(id);
    
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Landing page deleted successfully' });
  } catch (error) {
    console.error('Error deleting landing page:', error);
    return NextResponse.json({ error: 'Failed to delete landing page' }, { status: 500 });
  }
}
