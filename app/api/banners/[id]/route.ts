import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/lib/models/Banner';
import sharp from 'sharp';
import path from 'path';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Helper function to compress image for mobile
const compressForMobile = async (imagePath: string): Promise<string> => {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const parsedPath = path.parse(imagePath);
    const mobileFilename = `${parsedPath.name}-mobile${parsedPath.ext}`;
    const mobilePath = path.join(uploadsDir, mobileFilename);
    
    // Compress for mobile: resize to max width 768px, quality 70%
    await sharp(path.join(process.cwd(), 'public', imagePath))
      .resize(768, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 70 })
      .toFile(mobilePath);
    
    return `/uploads/${mobileFilename}`;
  } catch (error) {
    console.error('Error compressing image for mobile:', error);
    return imagePath; // Return original if compression fails
  }
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;
    const updateData = await request.json();

    // Check if banner exists
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Compress image for mobile if image is being updated (temporarily disabled for debugging)
    if (updateData.image && updateData.image !== banner.image) {
      console.log('Skipping image compression for debugging...');
      updateData.mobileImage = updateData.image; // Use same image for now
      // updateData.mobileImage = await compressForMobile(updateData.image);
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    
    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;

    // Check if banner exists
    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await Banner.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
