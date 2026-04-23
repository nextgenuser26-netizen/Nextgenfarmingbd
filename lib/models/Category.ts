import mongoose, { Schema, Document } from 'mongoose';

export interface IVariantType {
  name: string;
  options: string[];
}

export interface ICategory extends Document {
  name: string;
  name_en: string;
  icon: string;
  subcategories: string[];
  variants: IVariantType[];
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name_en: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  subcategories: [{
    type: String,
    trim: true,
  }],
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    options: [{
      type: String,
      required: true,
      trim: true,
    }],
  }],
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes
CategorySchema.index({ name: 1 });
CategorySchema.index({ name_en: 1 });
CategorySchema.index({ isActive: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
