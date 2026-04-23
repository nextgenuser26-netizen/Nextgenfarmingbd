import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteNameEn?: string;
  siteDescription?: string;
  siteDescriptionEn?: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  currency: string;
  currencySymbol: string;
  taxRate?: number;
  shippingCostInsideDhaka?: number;
  shippingCostOutsideDhaka?: number;
  freeShippingThreshold?: number;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: true,
      default: 'NextGen FarmingBD'
    },
    siteNameEn: {
      type: String,
      default: 'NextGen FarmingBD'
    },
    siteDescription: {
      type: String
    },
    siteDescriptionEn: {
      type: String
    },
    logo: {
      type: String
    },
    favicon: {
      type: String
    },
    contactEmail: {
      type: String,
      required: true,
      default: 'info@nextgenfarmingbd.com'
    },
    contactPhone: {
      type: String,
      required: true,
      default: '+8801XXXXXXXXX'
    },
    contactAddress: {
      type: String
    },
    socialFacebook: {
      type: String
    },
    socialInstagram: {
      type: String
    },
    socialTwitter: {
      type: String
    },
    socialYoutube: {
      type: String
    },
    currency: {
      type: String,
      required: true,
      default: 'BDT'
    },
    currencySymbol: {
      type: String,
      required: true,
      default: '৳'
    },
    taxRate: {
      type: Number,
      default: 0
    },
    shippingCostInsideDhaka: {
      type: Number,
      default: 60
    },
    shippingCostOutsideDhaka: {
      type: Number,
      default: 150
    },
    freeShippingThreshold: {
      type: Number,
      default: 5000
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: {
      type: String,
      default: 'We are currently under maintenance. Please check back later.'
    },
    seoTitle: {
      type: String
    },
    seoDescription: {
      type: String
    },
    seoKeywords: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
