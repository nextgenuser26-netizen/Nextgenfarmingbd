import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  if (normalized.startsWith('+880')) {
    normalized = '0' + normalized.substring(4);
  } else if (normalized.startsWith('880') && normalized.length === 13) {
    normalized = '0' + normalized.substring(3);
  }
  return normalized;
}

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query: any = { role: 'user' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const customers = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const total = await User.countDocuments(query);

    return NextResponse.json({ 
      customers,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const customerData = await request.json();
    
    // Validate required fields
    if (!customerData.name || !customerData.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhone(customerData.phone);

    // Check if phone already exists
    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
    }

    // Create new customer
    const customer = new User({
      name: customerData.name,
      phone: normalizedPhone,
      email: customerData.email || '',
      role: 'user',
      isActive: true,
      addresses: customerData.addresses || [],
    });

    await customer.save();
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }
    
    const updateData = await request.json();
    
    // If phone is being updated, normalize and check if it already exists
    if (updateData.phone) {
      updateData.phone = normalizePhone(updateData.phone);
      const existingUser = await User.findOne({ phone: updateData.phone, _id: { $ne: id } });
      if (existingUser) {
        return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
      }
    }
    
    const customer = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }
    
    const customer = await User.findByIdAndDelete(id);
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer', details: error.message }, { status: 500 });
  }
}
