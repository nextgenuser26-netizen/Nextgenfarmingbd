import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Banner from '@/lib/models/Banner';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if banners already exist
    const existingBanners = await Banner.countDocuments({ position: { $in: ['hero-carousel', 'hero-right-top', 'hero-right-bottom', 'featured-collections'] } });
    
    if (existingBanners > 0) {
      return NextResponse.json({ message: 'Demo banners already exist', count: existingBanners });
    }

    // Seed demo banners
    const demoBanners = [
      {
        title: 'বিশুদ্ধতায় অনন্য',
        title_en: 'স্বাদে সেরা',
        description: 'সরাসরি খামারীদের থেকে সংগৃহীত প্রিমিয়াম কোয়ালিটি পণ্য এখন আপনার হাতের নাগালে।',
        image: 'https://picsum.photos/seed/farm1/1200/800',
        link: '/shop',
        position: 'hero-carousel',
        order: 1,
        isActive: true
      },
      {
        title: 'প্রাকৃতিক স্বাস্থ্য',
        title_en: 'অর্গানিক মধু',
        description: 'সুন্দরবনের খাঁটি খলিশা ও গরাণ ফুলের মধু সংগ্রহ করুন সরাসরি আমাদের কাছ থেকে।',
        image: 'https://picsum.photos/seed/honey1/1200/800',
        link: '/shop?search=মধু',
        position: 'hero-carousel',
        order: 2,
        isActive: true
      },
      {
        title: 'নিত্যপ্রয়োজনীয়',
        title_en: 'তাজা বাজার',
        description: 'ঘি, তেল থেকে শুরু করে সব ধরনের নিত্য প্রয়োজনীয় মুদি পণ্য পান এক জায়গায়।',
        image: 'https://picsum.photos/seed/grocery1/1200/800',
        link: '/shop',
        position: 'hero-carousel',
        order: 3,
        isActive: true
      },
      {
        title: 'গ্রীষ্মের সেরা অফার',
        title_en: '৫০% পর্যন্ত ছাড়',
        description: 'সীমিত সময়ের জন্য বিশেষ ছাড় উপভোগ করুন',
        image: 'https://picsum.photos/seed/basket/400/400',
        link: '/offers',
        position: 'hero-right-top',
        order: 1,
        isActive: true
      },
      {
        title: 'সরাসরি বাগান থেকে',
        title_en: 'তাজা ফলমূল',
        description: 'সতেজ ফলমূল এখনই কিনুন',
        image: 'https://picsum.photos/seed/fruits2/400/400',
        link: '/shop',
        position: 'hero-right-bottom',
        order: 1,
        isActive: true
      },
      {
        title: 'আমাদের সেরা পণ্যসমূহ',
        title_en: 'Featured Collections',
        description: 'সেরা মানের খাঁটি পণ্য সংগ্রহ করুন এখনই এবং উপভোগ করুন প্রিমিয়াম লাইফস্টাইল।',
        image: 'https://picsum.photos/seed/pattern/1920/1080',
        link: '/shop',
        position: 'featured-collections',
        order: 1,
        isActive: true
      }
    ];

    const seededBanners = await Banner.insertMany(demoBanners);
    console.log(`Seeded ${seededBanners.length} demo banners`);

    return NextResponse.json({ 
      message: 'Demo banners seeded successfully', 
      count: seededBanners.length,
      banners: seededBanners
    });
  } catch (error) {
    console.error('Error seeding banners:', error);
    return NextResponse.json({ error: 'Failed to seed banners', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
