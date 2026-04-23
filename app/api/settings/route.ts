import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Settings from '@/lib/models/Settings';

const MONGODB_URI = "mongodb://mkrabbanicse_db_user:nobinislam420%40%23%24@ac-ru22zib-shard-00-00.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-01.g2korqj.mongodb.net:27017,ac-ru22zib-shard-00-02.g2korqj.mongodb.net:27017/nextgenfarming?ssl=true&replicaSet=atlas-jstves-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Get the first (and only) settings document, or create default one if it doesn't exist
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings
      settings = new Settings({
        siteName: 'NextGen FarmingBD',
        siteNameEn: 'NextGen FarmingBD',
        contactEmail: 'info@nextgenfarmingbd.com',
        contactPhone: '+8801XXXXXXXXX',
        currency: 'BDT',
        currencySymbol: '৳',
        shippingCost: 60,
        freeShippingThreshold: 1500
      });
      await settings.save();
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const settingsData = await request.json();
    
    // Get the first (and only) settings document, or create if it doesn't exist
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings
      settings = new Settings(settingsData);
    } else {
      // Update existing settings
      Object.assign(settings, settingsData);
    }
    
    await settings.save();
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
