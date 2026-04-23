const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../lib/models/Product');
const Category = require('../lib/models/Category');
const User = require('../lib/models/User');
const { categories, products } = require('../lib/data');

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
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

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding function
seedDatabase();
