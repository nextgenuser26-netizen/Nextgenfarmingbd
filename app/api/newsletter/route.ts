import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Newsletter from '@/lib/models/Newsletter';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const existingNewsletter = await Newsletter.findOne({ email });
    if (existingNewsletter) {
      if (existingNewsletter.isActive) {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
      } else {
        // Reactivate existing subscription
        existingNewsletter.isActive = true;
        existingNewsletter.subscribedAt = new Date();
        await existingNewsletter.save();
        return NextResponse.json({ message: 'Subscription reactivated successfully' });
      }
    }

    // Create new subscription
    const newsletter = await Newsletter.create({
      email,
      isActive: true,
      subscribedAt: new Date(),
    });

    return NextResponse.json({ message: 'Subscription successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating newsletter subscription:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const active = searchParams.get('active');

    let query: any = {};
    if (active !== null && active !== undefined) {
      query.isActive = active === 'true';
    }

    const newsletters = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await Newsletter.countDocuments(query);

    return NextResponse.json({
      newsletters,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
  }
}
