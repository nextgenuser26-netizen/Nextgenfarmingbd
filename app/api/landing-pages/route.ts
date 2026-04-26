import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LandingPage from '@/lib/models/LandingPage';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');
    const id = searchParams.get('id');

    // Get single landing page by ID
    if (id) {
      const landingPage = await LandingPage.findById(id);
      
      if (!landingPage) {
        return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
      }

      return NextResponse.json({ landingPage });
    }

    // Build query
    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (productId) {
      query.productId = productId;
    }

    const landingPages = await LandingPage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await LandingPage.countDocuments(query);

    return NextResponse.json({ 
      landingPages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json({ error: 'Failed to fetch landing pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const landingPageData = await request.json();
    
    // Set publishedAt if status is published
    if (landingPageData.status === 'published' && !landingPageData.publishedAt) {
      landingPageData.publishedAt = new Date();
    }
    
    const landingPage = new LandingPage(landingPageData);
    await landingPage.save();
    
    return NextResponse.json({ landingPage }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating landing page:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create landing page' }, { status: 500 });
  }
}
