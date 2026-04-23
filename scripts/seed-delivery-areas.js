const mongoose = require('mongoose');

// Import the compiled model
const DeliveryArea = require('../lib/models/DeliveryArea');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/nextgenfarming?retryWrites=true&w=majority';

const deliveryAreas = [
  {
    name: 'ঢাকা ভেতরে',
    nameEn: 'Inside Dhaka',
    charge: 60,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'ঢাকার বাইরে (সব জেলা)',
    nameEn: 'Outside Dhaka (All Districts)',
    charge: 150,
    cities: ['Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Outside'],
    isActive: true
  },
  {
    name: 'ঢাকা সদরঘাট',
    nameEn: 'Dhaka Sadarghat',
    charge: 50,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'উত্তরা',
    nameEn: 'Uttara',
    charge: 70,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'গুলশান',
    nameEn: 'Gulshan',
    charge: 80,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'বনানী',
    nameEn: 'Banani',
    charge: 80,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'ধানমন্ডি',
    nameEn: 'Dhanmondi',
    charge: 70,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'মিরপুর',
    nameEn: 'Mirpur',
    charge: 70,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'মোহাম্মদপুর',
    nameEn: 'Mohammadpur',
    charge: 70,
    cities: ['Dhaka'],
    isActive: true
  },
  {
    name: 'পল্লবী',
    nameEn: 'Pallabi',
    charge: 70,
    cities: ['Dhaka'],
    isActive: true
  }
];

async function seedDeliveryAreas() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing delivery areas
    await DeliveryArea.deleteMany({});
    console.log('Cleared existing delivery areas');

    // Insert new delivery areas
    const insertedAreas = await DeliveryArea.insertMany(deliveryAreas);
    console.log(`Inserted ${insertedAreas.length} delivery areas`);

    console.log('Delivery areas seeded successfully!');
  } catch (error) {
    console.error('Error seeding delivery areas:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDeliveryAreas();
