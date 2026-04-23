'use client';

import React from 'react';
import { Star, ShoppingCart, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    oldPrice?: number;
    image?: string;
    images?: string[];
    rating: number;
    reviews: number;
    weight: string;
  };
}

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const productImage = product.images?.[0] || product.image || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id || product.id || '',
      name: product.name,
      price: product.price,
      quantity: 1,
      image: productImage,
      variant: product.weight
    });
    
    setIsDrawerOpen(true);
    
    toast.success('সফলভাবে কার্টে যোগ করা হয়েছে!', {
      style: {
        borderRadius: '1.5rem',
        background: '#064e3b',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '12px 24px'
      },
    });
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-emerald-50 group p-4"
    >
      <Link href={`/shop/${product._id || product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#f9faf5] rounded-2xl border border-slate-100 flex items-center justify-center cursor-pointer">
          <Image 
            src={productImage} 
            alt={product.name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm">
              {discount}% ছাড়
            </div>
          )}
        </div>
      </Link>
      
      <div className="pt-4 space-y-2">
        <Link href={`/shop/${product._id || product.id}`}>
          <h3 className="font-bold text-slate-800 group-hover:text-brand-green transition-colors line-clamp-2 h-10 text-sm cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 italic font-medium">{product.weight}</p>
          <div className="flex items-center gap-1 text-emerald-600">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
          {product.oldPrice && (
            <span className="text-slate-400 line-through text-[10px]">৳{product.oldPrice}</span>
          )}
          <span className="text-brand-green-dark font-black text-lg italic">৳{product.price}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-4 py-2 rounded-xl border border-emerald-200 uppercase hover:bg-brand-green hover:text-white transition-all"
          >
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </motion.div>
  );
}
