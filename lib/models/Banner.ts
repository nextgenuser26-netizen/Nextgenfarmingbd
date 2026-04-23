import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: 'home' | 'category' | 'product' | 'all' | 'hero-carousel' | 'hero-right-top' | 'hero-right-bottom' | 'featured-collections';
  order: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    title_en: {
      type: String,
      trim: true
    },
    description: {
      type: String
    },
    description_en: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    mobileImage: {
      type: String
    },
    link: {
      type: String
    },
    position: {
      type: String,
      enum: ['home', 'category', 'product', 'all', 'hero-carousel', 'hero-right-top', 'hero-right-bottom', 'featured-collections'],
      default: 'home'
    },
    order: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
BannerSchema.index({ position: 1, order: 1 });
BannerSchema.index({ isActive: 1 });

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
