import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PageSEO from '@/lib/models/PageSEO';

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('pagePath');
    const status = searchParams.get('status');

    let query: any = {};
    if (pagePath) {
      query.pagePath = pagePath;
    }
    if (status) {
      query.status = status;
    }

    const seoData = await PageSEO.find(query).sort({ pageName: 1 });

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await request.json();

    // Check if pagePath already exists
    const existing = await PageSEO.findOne({ pagePath: body.pagePath });
    if (existing) {
      return NextResponse.json(
        { error: 'SEO for this page path already exists' },
        { status: 400 }
      );
    }

    const seoData = await PageSEO.create(body);

    return NextResponse.json(seoData, { status: 201 });
  } catch (error) {
    console.error('Error creating SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to create SEO data' },
      { status: 500 }
    );
  }
}
