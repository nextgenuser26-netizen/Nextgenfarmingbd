import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PageSEO from '@/lib/models/PageSEO';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { id } = await params;
    const seoData = await PageSEO.findById(id);

    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await request.json();
    const { id } = await params;

    // If pagePath is being changed, check for duplicates
    if (body.pagePath) {
      const existing = await PageSEO.findOne({
        pagePath: body.pagePath,
        _id: { $ne: id }
      });
      if (existing) {
        return NextResponse.json(
          { error: 'This page path is already in use' },
          { status: 400 }
        );
      }
    }

    const seoData = await PageSEO.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(seoData);
  } catch (error) {
    console.error('Error updating SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { id } = await params;
    const seoData = await PageSEO.findByIdAndDelete(id);

    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'SEO data deleted successfully' });
  } catch (error) {
    console.error('Error deleting SEO data:', error);
    return NextResponse.json(
      { error: 'Failed to delete SEO data' },
      { status: 500 }
    );
  }
}
