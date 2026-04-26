import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  title_en?: string;
  slug: string;
  content: string;
  content_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: string;
  tags?: string[];
  category?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    content_en: {
      type: String
    },
    excerpt: {
      type: String
    },
    excerpt_en: {
      type: String
    },
    featuredImage: {
      type: String
    },
    featuredImageAlt: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      required: true
    },
    tags: [{
      type: String
    }],
    category: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: {
      type: Date
    },
    // SEO fields
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    metaKeywords: {
      type: String,
      trim: true
    },
    ogImage: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ publishedAt: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
