import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y';
  discountValue: number;
  products?: mongoose.Types.ObjectId[];
  categories?: string[];
  startDate: Date;
  endDate: Date;
  minOrderValue?: number;
  maxUses?: number;
  currentUses?: number;
  code?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
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
      type: String,
      required: true
    },
    description_en: {
      type: String
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'buy_x_get_y'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
    categories: [{
      type: String
    }],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    minOrderValue: {
      type: Number
    },
    maxUses: {
      type: Number
    },
    currentUses: {
      type: Number,
      default: 0
    },
    code: {
      type: String,
      unique: true,
      uppercase: true
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
DealSchema.index({ isActive: 1, startDate: -1 });
DealSchema.index({ code: 1 });
DealSchema.index({ endDate: 1 });

export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);
