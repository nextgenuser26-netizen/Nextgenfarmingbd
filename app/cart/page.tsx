'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const shipping = subtotal >= 10000 ? 0 : 60;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
           <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-brand-green">
              <ShoppingCart size={64} />
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-black text-brand-green-dark italic tracking-tight">আপনার কার্ট খালি!</h1>
              <p className="text-slate-500 font-medium italic">আপনার পছন্দের ন্যাচারাল পণ্যগুলো কার্টে যোগ করে শপিং শুরু করুন।</p>
           </div>
           <Link href="/shop" className="inline-flex items-center gap-3 bg-brand-green text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> শপে ফিরে যান
           </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-12">
           <h1 className="text-4xl md:text-6xl font-black text-brand-green-dark italic tracking-tighter">শপিং কার্ট ({totalItems})</h1>
           <p className="text-slate-400 font-bold italic mt-2">আপনার পছন্দের পণ্যের তালিকা এবং মূল্য দেখুন</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm overflow-hidden">
               <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-6 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="col-span-6">পণ্য</div>
                  <div className="col-span-2 text-center">মূল্য</div>
                  <div className="col-span-2 text-center">পরিমাণ</div>
                  <div className="col-span-2 text-right">মোট</div>
               </div>

               <div className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.variant}`}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-8 md:p-10 group"
                      >
                        <div className="md:col-span-6 flex items-center gap-6">
                           <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-slate-50 shadow-sm">
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill 
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                           </div>
                           <div className="space-y-1">
                              <h3 className="font-black text-xl text-brand-green-dark italic leading-tight group-hover:text-brand-green transition-colors">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{item.variant}</p>
                              )}
                              <button 
                                onClick={() => removeFromCart(item.id, item.variant)}
                                className="text-brand-red font-black text-[10px] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2"
                              >
                                <Trash2 size={12} /> মুছে ফেলুন
                              </button>
                           </div>
                        </div>

                        <div className="md:col-span-2 text-center font-black text-brand-green-dark">
                           <span className="md:hidden text-[10px] text-slate-400 block mb-1">মূল্য</span>
                           ৳{item.price}
                        </div>

                        <div className="md:col-span-2 flex justify-center">
                           <div className="flex items-center bg-brand-bg rounded-xl p-1 border border-slate-50">
                              <button 
                                onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-green"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-black text-brand-green-dark">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-green"
                              >
                                <Plus size={14} />
                              </button>
                           </div>
                        </div>

                        <div className="md:col-span-2 text-right font-black text-brand-green italic text-xl">
                           <span className="md:hidden text-[10px] text-slate-400 block mb-1">মোট</span>
                           ৳{item.price * item.quantity}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
               <Link href="/shop" className="text-brand-green font-black italic flex items-center gap-2 hover:underline group">
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> শপে ফিরে যান
               </Link>
               <button 
                 onClick={clearCart}
                 className="text-slate-400 font-bold italic text-sm hover:text-brand-red transition-colors flex items-center gap-2"
               >
                  কার্ট পরিষ্কার করুন
               </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
             <div className="bg-brand-green-dark text-white rounded-[3.5rem] p-10 md:p-12 space-y-10 shadow-2xl shadow-brand-green/20">
                <div className="space-y-4">
                   <h2 className="text-3xl font-black italic tracking-tighter">অর্ডার সারসংক্ষেপ</h2>
                   <div className="w-12 h-1 bg-emerald-400 rounded-full" />
                </div>

                <div className="space-y-6">
                   <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                      <span>সাব-টোটাল ({totalItems} আইটেম)</span>
                      <span className="font-black text-white">৳{subtotal}</span>
                   </div>
                   <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="font-black text-white">{shipping === 0 ? 'ফ্রি' : `৳${shipping}`}</span>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                      <Truck size={18} className="text-emerald-400" />
                      <p className="text-[10px] text-emerald-100/60 font-black italic">ঢাকার ভেতরে অথবা ১০০০০ টাকার উপরে ফ্রি ডেলিভারি!</p>
                   </div>
                   <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-sm font-black text-emerald-400 uppercase tracking-widest block">Total Amount</span>
                        <span className="text-5xl font-black tracking-tighter italic">৳{total}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <Link 
                     href="/checkout"
                     className="w-full bg-white text-brand-green-dark py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl shadow-black/20"
                   >
                      চেকআউট করুন <ArrowRight size={20} />
                   </Link>
                   <p className="text-[10px] text-emerald-100/40 text-center font-bold italic">চেকআউট করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে একমত হচ্ছেন।</p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                   <div className="flex flex-col items-center gap-2 text-center opacity-60">
                      <ShieldCheck size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100">বিশুদ্ধ পণ্য</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 text-center opacity-60">
                      <Truck size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100">দ্রুত ডেলিভারি</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 text-center opacity-60">
                      <CreditCard size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100">নিরাপদ পেমেন্ট</span>
                   </div>
                </div>
             </div>

             {/* Discount Code */}
             <div className="mt-8 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ডিসকাউন্ট কোড আছে?</label>
                   <div className="flex gap-2">
                      <input type="text" placeholder="কুপন কোড লিখুন" className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-3 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300" />
                      <button className="bg-brand-green-dark text-white px-6 rounded-2xl font-black text-xs hover:bg-brand-green transition-all uppercase tracking-widest">লিখুন</button>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
