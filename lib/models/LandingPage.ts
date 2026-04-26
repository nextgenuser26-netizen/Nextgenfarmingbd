import mongoose, { Schema, Document } from 'mongoose';

export interface ILandingPage extends Document {
  title: string;
  title_en?: string;
  slug: string;
  productId?: string;
  heroImage?: string;
  heroTitle: string;
  heroTitle_en?: string;
  heroSubtitle?: string;
  heroSubtitle_en?: string;
  heroCtaText?: string;
  heroCtaText_en?: string;
  heroCtaLink?: string;
  contentSections: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    image?: string;
    order: number;
  }[];
  features?: {
    icon?: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
  }[];
  testimonials?: {
    name: string;
    name_en?: string;
    content: string;
    content_en?: string;
    rating?: number;
    image?: string;
  }[];
  faq?: {
    question: string;
    question_en?: string;
    answer: string;
    answer_en?: string;
  }[];
  // Checkout settings
  enableCheckout?: boolean;
  checkoutTitle?: string;
  checkoutTitle_en?: string;
  checkoutSubtitle?: string;
  checkoutSubtitle_en?: string;
  customPrice?: number;
  discountPrice?: number;
  showQuantity?: boolean;
  defaultQuantity?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema: Schema = new Schema(
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
    productId: {
      type: String,
      trim: true
    },
    heroImage: {
      type: String
    },
    heroTitle: {
      type: String,
      required: true,
      trim: true
    },
    heroTitle_en: {
      type: String,
      trim: true
    },
    heroSubtitle: {
      type: String,
      trim: true
    },
    heroSubtitle_en: {
      type: String,
      trim: true
    },
    heroCtaText: {
      type: String,
      trim: true
    },
    heroCtaText_en: {
      type: String,
      trim: true
    },
    heroCtaLink: {
      type: String,
      trim: true
    },
    contentSections: [{
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
        type: String,
        required: true
      },
      description_en: {
        type: String
      },
      image: {
        type: String
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    features: [{
      icon: {
        type: String
      },
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
        type: String,
        required: true
      },
      description_en: {
        type: String
      }
    }],
    testimonials: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      name_en: {
        type: String,
        trim: true
      },
      content: {
        type: String,
        required: true
      },
      content_en: {
        type: String
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      image: {
        type: String
      }
    }],
    faq: [{
      question: {
        type: String,
        required: true,
        trim: true
      },
      question_en: {
        type: String,
        trim: true
      },
      answer: {
        type: String,
        required: true
      },
      answer_en: {
        type: String
      }
    }],
    // Checkout settings
    enableCheckout: {
      type: Boolean,
      default: false
    },
    checkoutTitle: {
      type: String,
      trim: true
    },
    checkoutTitle_en: {
      type: String,
      trim: true
    },
    checkoutSubtitle: {
      type: String,
      trim: true
    },
    checkoutSubtitle_en: {
      type: String,
      trim: true
    },
    customPrice: {
      type: Number
    },
    discountPrice: {
      type: Number
    },
    showQuantity: {
      type: Boolean,
      default: false
    },
    defaultQuantity: {
      type: Number,
      default: 1
    },
    seoTitle: {
      type: String,
      trim: true
    },
    seoDescription: {
      type: String,
      trim: true
    },
    seoKeywords: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
LandingPageSchema.index({ slug: 1 });
LandingPageSchema.index({ status: 1 });
LandingPageSchema.index({ productId: 1 });

export default mongoose.models.LandingPage || mongoose.model<ILandingPage>('LandingPage', LandingPageSchema);
