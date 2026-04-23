import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Deal from '@/lib/models/Deal';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query: any = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    
    const total = await Deal.countDocuments(query);
    
    return NextResponse.json({ 
      deals,
      total,
      limit,
      offset
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const dealData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'discountType', 'discountValue', 'startDate', 'endDate'];
    for (const field of requiredFields) {
      if (!dealData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Validate dates
    if (new Date(dealData.endDate) <= new Date(dealData.startDate)) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }
    
    // Generate code if not provided
    if (!dealData.code) {
      dealData.code = `DEAL-${Date.now().toString(36).toUpperCase()}`;
    }
    
    const deal = new Deal(dealData);
    await deal.save();
    
    return NextResponse.json(deal, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Deal code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
