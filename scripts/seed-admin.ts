import mongoose from 'mongoose';
import Admin from '../lib/models/Admin';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin user if any
    await Admin.deleteMany({});

    // Create admin user with new credentials
    const admin = await Admin.create({
      username: 'nextgenadmin',
      password: 'nextgen@#$%&',
      email: 'admin@nextgenfarmingbd.com',
    });

    console.log('Admin user created successfully');
    console.log('Username: nextgenadmin');
    console.log('Password: nextgen@#$%&');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
