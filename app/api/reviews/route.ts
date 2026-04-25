import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Review from '@/lib/models/Review';
import Product from '@/lib/models/Product';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    console.log('[GET /api/reviews] Fetching reviews');
    await mongoose.connect(MONGODB_URI);
    console.log('[GET /api/reviews] Connected to MongoDB');

    let query: any = {};
    
    // If productId is provided, filter by product
    if (productId) {
      // Convert string ID to ObjectId, or use string if invalid
      try {
        query.productId = new mongoose.Types.ObjectId(productId);
        console.log('[GET /api/reviews] Converted to ObjectId:', query.productId);
      } catch (e) {
        // If not a valid ObjectId, use the string directly
        query.productId = productId;
        console.log('[GET /api/reviews] Using string ID:', query.productId);
      }
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('[GET /api/reviews] Found reviews:', reviews.length);
    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('[GET /api/reviews] Error fetching reviews:', error);
    console.error('[GET /api/reviews] Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId, userName, rating, comment } = body;

    if (!productId || !userId || !userName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    await mongoose.connect(MONGODB_URI);

    // Convert string IDs to ObjectIds, or use strings if invalid
    let productObjectId, userObjectId;
    try {
      productObjectId = new mongoose.Types.ObjectId(productId);
    } catch {
      productObjectId = productId;
    }
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch {
      userObjectId = userId;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId: productObjectId, userId: userObjectId });
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    // Create new review
    const review = await Review.create({
      productId: productObjectId,
      userId: userObjectId,
      userName,
      rating,
      comment,
    });

    // Update product's average rating
    const allReviews = await Review.find({ productId: productObjectId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(productObjectId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, userId, rating, comment } = body;

    if (!reviewId || !userId) {
      return NextResponse.json({ error: 'Review ID and User ID are required' }, { status: 400 });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    await mongoose.connect(MONGODB_URI);

    // Convert string IDs to ObjectIds, or use strings if invalid
    let reviewObjectId, userObjectId;
    try {
      reviewObjectId = new mongoose.Types.ObjectId(reviewId);
    } catch {
      reviewObjectId = reviewId;
    }
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch {
      userObjectId = userId;
    }

    // Find the review
    const review = await Review.findById(reviewObjectId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== userObjectId.toString()) {
      return NextResponse.json({ error: 'You can only edit your own reviews' }, { status: 403 });
    }

    // Update the review
    const updateData: any = {};
    if (rating) updateData.rating = rating;
    if (comment) updateData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewObjectId,
      updateData,
      { new: true }
    );

    // Update product's average rating
    const allReviews = await Review.find({ productId: review.productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length,
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');
    const userId = searchParams.get('userId');

    if (!reviewId || !userId) {
      return NextResponse.json({ error: 'Review ID and User ID are required' }, { status: 400 });
    }

    await mongoose.connect(MONGODB_URI);

    // Convert string IDs to ObjectIds, or use strings if invalid
    let reviewObjectId, userObjectId;
    try {
      reviewObjectId = new mongoose.Types.ObjectId(reviewId);
    } catch {
      reviewObjectId = reviewId;
    }
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch {
      userObjectId = userId;
    }

    // Find the review
    const review = await Review.findById(reviewObjectId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== userObjectId.toString()) {
      return NextResponse.json({ error: 'You can only delete your own reviews' }, { status: 403 });
    }

    const productId = review.productId;

    // Delete the review
    await Review.findByIdAndDelete(reviewObjectId);

    // Update product's average rating
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length,
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
