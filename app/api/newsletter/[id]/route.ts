import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Newsletter from '@/lib/models/Newsletter';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(MONGODB_URI);
    const { id } = await params;

    console.log('Deleting newsletter with ID:', id);

    const newsletter = await Newsletter.findByIdAndDelete(id);

    if (!newsletter) {
      console.log('Newsletter not found with ID:', id);
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    console.log('Newsletter deleted successfully:', id);
    return NextResponse.json({ message: 'Newsletter deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting newsletter:', error);
    console.error('Error details:', error.message, error.code);
    return NextResponse.json({ error: 'Failed to delete newsletter', details: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongoose.connect(MONGODB_URI);
    const { id } = await params;
    const body = await request.json();

    const newsletter = await Newsletter.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Error updating newsletter:', error);
    return NextResponse.json({ error: 'Failed to update newsletter' }, { status: 500 });
  }
}
