import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Newsletter from '@/lib/models/Newsletter';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Mark all unread newsletters as read
    const result = await Newsletter.updateMany(
      { viewedByAdmin: false },
      { $set: { viewedByAdmin: true } }
    );

    return NextResponse.json({ message: 'Marked as read', count: result.modifiedCount });
  } catch (error) {
    console.error('Error marking newsletters as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark as read' },
      { status: 500 }
    );
  }
}
