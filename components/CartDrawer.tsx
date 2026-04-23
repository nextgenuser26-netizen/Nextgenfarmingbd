'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-brand-green-dark/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-[#fcfdfa]">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                     <ShoppingCart size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-green-dark italic">আপনার ব্যাগ</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{totalItems} আইটেম যুক্ত আছে</p>
                  </div>
               </div>
               <button 
                 onClick={() => setIsDrawerOpen(false)}
                 className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
               >
                  <X size={24} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-brand-green/30">
                       <ShoppingCart size={40} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-black text-brand-green-dark italic">ব্যাগ একদম খালি!</h3>
                       <p className="text-sm text-slate-400 font-medium italic">আপনার পছন্দের পণ্যগুলো যোগ করুন</p>
                    </div>
                    <button 
                      onClick={() => setIsDrawerOpen(false)}
                      className="bg-brand-green text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-brand-green/20"
                    >
                       শপিং শুরু করুন
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                         <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                            {item.image && (
                              <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                            )}
                         </div>
                         <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start">
                               <h4 className="font-black text-brand-green-dark text-sm italic truncate pr-4">{item.name}</h4>
                               <button 
                                 onClick={() => removeFromCart(item.id, item.variant)}
                                 className="text-brand-red/70 hover:text-brand-red transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.variant}</p>
                            <div className="flex items-center justify-between pt-2">
                               <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-green"
                                  >
                                     <Minus size={12} />
                                  </button>
                                  <span className="w-6 text-center text-xs font-black text-brand-green-dark">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-brand-green"
                                  >
                                     <Plus size={12} />
                                  </button>
                               </div>
                               <span className="font-black text-brand-green text-sm italic">৳{item.price * item.quantity}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-50 space-y-6 bg-[#fcfdfa]">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center italic">
                       <span className="text-slate-500 font-medium">সাব-টোটাল</span>
                       <span className="text-brand-green-dark font-black text-lg">৳{subtotal}</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl flex items-center gap-3">
                       <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-green shadow-sm">
                          <Truck size={16} />
                       </div>
                       <p className="text-[10px] text-brand-green-dark font-black italic">ঢাকার ভেতরে অথবা ১০০০০ টাকার উপরে ফ্রি ডেলিভারি!</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <Link 
                      href="/cart" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="bg-white border-2 border-slate-50 text-slate-600 py-4 rounded-2xl font-black text-xs text-center flex items-center justify-center hover:bg-slate-50 transition-all"
                    >
                       ব্যাগ দেখুন
                    </Link>
                    <Link 
                      href="/checkout" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="bg-brand-green-dark text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-brand-green/20 hover:bg-brand-green transition-all"
                    >
                       চেকআউট <ArrowRight size={14} />
                    </Link>
                 </div>

                 <div className="flex items-center justify-center gap-6 opacity-30">
                    <ShieldCheck size={20} />
                    <Truck size={20} />
                    <div className="w-8 h-1 bg-slate-200 rounded-full" />
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
