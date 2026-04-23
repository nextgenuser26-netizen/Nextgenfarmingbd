import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryArea extends Document {
  name: string;
  nameEn?: string;
  charge: number;
  cities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryAreaSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nameEn: {
    type: String
  },
  charge: {
    type: Number,
    required: true,
    min: 0
  },
  cities: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
DeliveryAreaSchema.index({ name: 1 });
DeliveryAreaSchema.index({ isActive: 1 });

export default mongoose.models.DeliveryArea || mongoose.model<IDeliveryArea>('DeliveryArea', DeliveryAreaSchema);
