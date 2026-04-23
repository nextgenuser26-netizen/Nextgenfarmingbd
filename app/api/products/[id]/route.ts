import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;
    const updateData = await request.json();

    console.log('Update data received:', updateData);

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate images array if provided
    if (updateData.images && (!Array.isArray(updateData.images) || updateData.images.length === 0)) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    // Validate galleryImages array if provided
    if (updateData.galleryImages !== undefined) {
      if (!Array.isArray(updateData.galleryImages)) {
        return NextResponse.json({ error: 'galleryImages must be an array' }, { status: 400 });
      }
      if (updateData.galleryImages.length > 2) {
        return NextResponse.json({ error: 'Maximum 2 gallery images allowed' }, { status: 400 });
      }
    }

    // Validate price based on hasVariants if provided
    if (updateData.hasVariants !== undefined) {
      if (updateData.hasVariants) {
        // When has variants, validate variants array and their prices
        if (!Array.isArray(updateData.variants) || updateData.variants.length === 0) {
          return NextResponse.json({ error: 'At least one variant is required when hasVariants is true' }, { status: 400 });
        }
        for (const variant of updateData.variants) {
          if (!variant.price || variant.price <= 0) {
            return NextResponse.json({ error: 'All variants must have a valid price' }, { status: 400 });
          }
        }
      } else {
        // When no variants, validate main price
        if (updateData.price !== undefined && (!updateData.price || updateData.price <= 0)) {
          return NextResponse.json({ error: 'Price is required and must be greater than 0' }, { status: 400 });
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { id } = await params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
