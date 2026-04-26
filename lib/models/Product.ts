import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  name_en: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images: string[];
  galleryImages: string[];
  mainImageIndex: number;
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  weight?: string;
  inStock: boolean;
  description?: string;
  details?: string;
  tags?: string[];
  variants?: {
    name: string;
    name_en?: string;
    price: number;
    oldPrice?: number;
    inStock: boolean;
  }[];
  hasVariants: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  name_en: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  oldPrice: {
    type: Number,
    min: 0,
  },
  image: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  galleryImages: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 2;
      },
      message: 'Maximum 2 gallery images allowed'
    }
  },
  mainImageIndex: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  subcategory: {
    type: String,
    index: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  weight: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  details: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    name_en: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    oldPrice: {
      type: Number,
      min: 0
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  hasVariants: {
    type: Boolean,
    default: false
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
}, {
  timestamps: true,
});

// Create indexes for better performance
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ name: 'text', name_en: 'text' });
ProductSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
