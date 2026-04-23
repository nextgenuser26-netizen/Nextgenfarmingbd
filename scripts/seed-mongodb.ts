const mongoose = require('mongoose');
const Product = require('../lib/models/Product');
const Category = require('../lib/models/Category');
const User = require('../lib/models/User');
const Banner = require('../lib/models/Banner');
const { categories, products } = require('../lib/data');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/nextgenfarming?retryWrites=true&w=majority';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    console.log('Cleared existing data');

    // Seed categories
    const seededCategories = await Category.insertMany(
      categories.map((cat: any) => ({
        ...cat,
        isActive: true
      }))
    );
    console.log(`Seeded ${seededCategories.length} categories`);

    // Seed products
    const seededProducts = await Product.insertMany(
      products.map((product: any) => ({
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

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding function
seedDatabase();
