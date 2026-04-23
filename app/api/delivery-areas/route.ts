import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import DeliveryArea from '@/lib/models/DeliveryArea';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const deliveryAreas = await DeliveryArea.find({ isActive: true }).sort({ charge: 1 });

    return NextResponse.json({ deliveryAreas });
  } catch (error) {
    console.error('Error fetching delivery areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery areas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await request.json();
    const { name, nameEn, charge, cities } = body;

    const deliveryArea = await DeliveryArea.create({
      name,
      nameEn,
      charge,
      cities,
      isActive: true
    });

    return NextResponse.json({ deliveryArea }, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery area:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery area' },
      { status: 500 }
    );
  }
}
