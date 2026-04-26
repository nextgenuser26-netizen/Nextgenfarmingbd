import mongoose, { Schema, Document } from 'mongoose';

export interface IPageSEO extends Document {
  pagePath: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  robots?: string;
  structuredData?: string; // JSON string for schema.org data
  customHeadTags?: string; // Additional custom head tags
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const PageSEOSchema: Schema = new Schema(
  {
    pagePath: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    pageName: {
      type: String,
      required: true,
      trim: true
    },
    metaTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    metaKeywords: {
      type: String,
      trim: true
    },
    ogTitle: {
      type: String,
      trim: true
    },
    ogDescription: {
      type: String,
      trim: true
    },
    ogImage: {
      type: String,
      trim: true
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image'
    },
    canonicalUrl: {
      type: String,
      trim: true
    },
    robots: {
      type: String,
      trim: true,
      default: 'index, follow'
    },
    structuredData: {
      type: String // JSON string
    },
    customHeadTags: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
PageSEOSchema.index({ pagePath: 1 });
PageSEOSchema.index({ status: 1 });

export default mongoose.models.PageSEO || mongoose.model<IPageSEO>('PageSEO', PageSEOSchema);
