import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import User from '@/lib/models/User';
import { categories, products } from '@/lib/data';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Seed categories
    const seededCategories = await Category.insertMany(
      categories.map(cat => ({
        ...cat,
        isActive: true
      }))
    );
    console.log(`Seeded ${seededCategories.length} categories`);

    // Seed products
    const seededProducts = await Product.insertMany(
      products.map(product => ({
        ...product,
        inStock: true,
        tags: [product.category.toLowerCase().replace(/\s+/g, '-')]
      }))
    );
    console.log(`Seeded ${seededProducts.length} products`);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@nextgenfarming.com',
      role: 'admin',
      emailVerified: true,
      isActive: true,
      addresses: [{
        street: '123 Admin Street',
        city: 'Dhaka',
        state: 'Dhaka',
        zipCode: '1000',
        country: 'Bangladesh',
        isDefault: true
      }]
    });
    
    await adminUser.save();
    console.log('Created admin user');

    await mongoose.disconnect();

    return NextResponse.json({ 
      message: 'Database seeded successfully!',
      categories: seededCategories.length,
      products: seededProducts.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
