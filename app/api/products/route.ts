import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = parseInt(searchParams.get('offset') || '0');

    if (id) {
      // Get single product by ID
      const product = await Product.findById(id);
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    // Build query
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let queryBuilder = Product.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }
    
    const products = await queryBuilder.skip(offset);

    const total = await Product.countDocuments(query);

    return NextResponse.json({ 
      products,
      pagination: {
        total,
        limit: limit || total,
        offset,
        hasMore: limit ? offset + limit < total : false
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const productData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'name_en', 'category', 'images'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Validate price based on hasVariants
    if (productData.hasVariants) {
      // When has variants, validate variants array and their prices
      if (!Array.isArray(productData.variants) || productData.variants.length === 0) {
        return NextResponse.json({ error: 'At least one variant is required when hasVariants is true' }, { status: 400 });
      }
      for (const variant of productData.variants) {
        if (!variant.price || variant.price <= 0) {
          return NextResponse.json({ error: 'All variants must have a valid price' }, { status: 400 });
        }
      }
    } else {
      // When no variants, validate main price
      if (!productData.price || productData.price <= 0) {
        return NextResponse.json({ error: 'Price is required and must be greater than 0' }, { status: 400 });
      }
    }
    
    // Validate images array
    if (!Array.isArray(productData.images) || productData.images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    const product = new Product(productData);
    await product.save();
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
