import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Order from '@/lib/models/Order';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Count orders where viewedByAdmin is false or doesn't exist (for backward compatibility)
    const unreadCount = await Order.countDocuments({
      $or: [
        { viewedByAdmin: false },
        { viewedByAdmin: { $exists: false } }
      ]
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread order count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread order count' },
      { status: 500 }
    );
  }
}
