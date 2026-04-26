import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  name_en: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  userId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: IOrderItem[];
  totalAmount: number;
  deliveryCharge: number;
  deliveryArea?: string;
  deliveryAreaName?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  viewedByAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true,
  },
  orderNumber: {
    type: String,
    unique: true,
    index: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
  },
  items: [{
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    name_en: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
    min: 0,
  },
  deliveryArea: {
    type: String,
  },
  deliveryAreaName: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true,
  },
  notes: {
    type: String,
  },
  viewedByAdmin: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

// Create indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderNumber: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
