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
        freeShippingThreshold: 1500,
        bannerImage: ''
      });
      await settings.save();
    } else {
      // If bannerImage field doesn't exist in the document, add it and save
      if (settings.bannerImage === undefined || settings.bannerImage === null) {
        console.log('Initializing bannerImage field in existing document');
        settings.bannerImage = '';
        await settings.save();
      }
    }
    
    console.log('Fetched settings:', settings);
    console.log('Banner image from DB:', settings.bannerImage);
    console.log('Ticker messages from DB:', settings.tickerMessages);
    
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
    
    console.log('Updating settings with data:', settingsData);
    console.log('Banner image in request:', settingsData.bannerImage);
    console.log('Ticker messages in request:', settingsData.tickerMessages);
    
    // Use findOneAndUpdate with upsert to ensure bannerImage is saved
    const settings = await Settings.findOneAndUpdate(
      {}, // Find any document (there should only be one)
      {
        $set: {
          siteName: settingsData.siteName,
          siteNameEn: settingsData.siteNameEn,
          siteDescription: settingsData.siteDescription,
          siteDescriptionEn: settingsData.siteDescriptionEn,
          logo: settingsData.logo,
          favicon: settingsData.favicon,
          bannerImage: settingsData.bannerImage || '',
          contactEmail: settingsData.contactEmail,
          contactPhone: settingsData.contactPhone,
          contactAddress: settingsData.contactAddress,
          socialFacebook: settingsData.socialFacebook,
          socialInstagram: settingsData.socialInstagram,
          socialTwitter: settingsData.socialTwitter,
          socialYoutube: settingsData.socialYoutube,
          currency: settingsData.currency,
          currencySymbol: settingsData.currencySymbol,
          taxRate: settingsData.taxRate,
          shippingCostInsideDhaka: settingsData.shippingCostInsideDhaka,
          shippingCostOutsideDhaka: settingsData.shippingCostOutsideDhaka,
          freeShippingThreshold: settingsData.freeShippingThreshold,
          maintenanceMode: settingsData.maintenanceMode,
          maintenanceMessage: settingsData.maintenanceMessage,
          seoTitle: settingsData.seoTitle,
          seoDescription: settingsData.seoDescription,
          seoKeywords: settingsData.seoKeywords,
          tickerMessages: settingsData.tickerMessages
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
    
    console.log('Settings saved successfully:', settings);
    console.log('Banner image after save:', settings.bannerImage);
    console.log('Ticker messages after save:', settings.tickerMessages);
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
