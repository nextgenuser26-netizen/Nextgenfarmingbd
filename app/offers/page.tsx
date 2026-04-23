'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { motion } from 'motion/react';
import { Flame, Star, Zap, Sparkles, Percent, Gift, Clock, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OffersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPagesBanner, setAllPagesBanner] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchAllPagesBanner();
  }, []);

  const fetchAllPagesBanner = async () => {
    try {
      const res = await fetch('/api/banners?isActive=true&position=all');
      const data = await res.json();
      const banners = data.banners || [];
      if (banners.length > 0) {
        setAllPagesBanner(banners[0]);
      }
    } catch (error) {
      console.error('Error fetching all pages banner:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products that have a discount
  const discountedProducts = products.filter((p: any) => p.oldPrice && p.oldPrice > p.price);

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold italic">Loading offers...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg pb-0">
      <Header />
      
      {/* Premium Hero Section */}
      {allPagesBanner ? (
        <Link href={allPagesBanner.link || '/offers'} className="block w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={allPagesBanner.image}
              alt={allPagesBanner.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>
      ) : (
        <section className="bg-brand-green-dark py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/offers/1920/1080')] bg-cover bg-center mix-blend-overlay" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />

          <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block bg-brand-red px-6 py-2 rounded-full text-xs font-black text-white uppercase tracking-[0.3em] mb-8 animate-pulse shadow-lg shadow-brand-red/20"
            >
              Limited Time Offers
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black text-white italic mb-10 leading-tight"
            >
              সেরা পণ্যে <span className="text-emerald-300 underline underline-offset-8 decoration-white/20">সেরা অফার!</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-50/80 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium italic"
            >
              আমাদের প্রিমিয়াম কোয়ালিটি পণ্যের ওপর পান আকর্ষণীয় ডিসকাউন্ট এবং গিফট। এখনই অর্ডার করুন এবং সাশ্রয় করুন।
            </motion.p>
          </div>
        </section>
      )}

      {/* Featured Promo Cards */}
      <section className="py-16 md:-mt-16 relative z-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-50 flex flex-col items-center text-center space-y-4"
           >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green">
                <Percent size={32} />
              </div>
              <h3 className="text-xl font-black text-brand-green-dark">১০% ডিসকাউন্ট</h3>
              <p className="text-slate-500 text-sm italic font-medium">প্রথম অর্ডারে পান flat ১০% ডিসকাউন্ট। কোড: <span className="text-brand-green font-black select-all">NEXTGEN10</span></p>
           </motion.div>
           
           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-brand-green text-white p-8 rounded-[3rem] shadow-xl shadow-brand-green/20 flex flex-col items-center text-center space-y-4"
           >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-black">ফ্রি ডেলিভারি</h3>
              <p className="text-emerald-50 text-sm italic font-medium">ঢাকার ভেতরে অথবা ১০০০০ টাকার উপরে কেনাকাটায় ফ্রি ডেলিভারি!</p>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-50 flex flex-col items-center text-center space-y-4"
           >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-black text-brand-green-dark">স্পেশাল প্রোমো</h3>
              <p className="text-slate-500 text-sm italic font-medium">প্রতিটি বড় অর্ডারের সাথে থাকছে একটি আকর্ষণীয় গিফট আইটেম।</p>
           </motion.div>
        </div>
      </section>

      {/* Main Offers Grid */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex justify-between items-end mb-12 border-b border-emerald-50 pb-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-red shadow-sm border border-emerald-50">
                    <Flame size={24} className="animate-pulse" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-brand-green-dark italic">ধামাকা অফার সমূহ</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Flash Sale - Discount up to 50%</p>
                 </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-brand-green text-xs font-black italic">
                 <Clock size={14} />
                 অফারটি শেষ হতে আর অল্প সময় বাকি
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {discountedProducts.map((product: any) => (
                <div key={product._id} className="relative group">
                   <ProductCard product={product} />
                   <div className="absolute top-4 right-4 bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce">
                      {Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)}% OFF
                   </div>
                </div>
              ))}
           </div>

           {discountedProducts.length === 0 && (
             <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-emerald-200">
                <Sparkles size={48} className="mx-auto text-emerald-100 mb-6" />
                <p className="text-slate-400 italic text-lg font-medium">বর্তমানে কোনো অফার লাইভ নেই। আমাদের সাথেই থাকুন!</p>
             </div>
           )}
        </div>
      </section>

      {/* Special Category Banner */}
      <section className="py-16 px-4 md:px-8">
         <div className="max-w-7xl mx-auto bg-brand-green-dark rounded-[4rem] overflow-hidden relative shadow-2xl p-10 md:p-20 text-center space-y-8">
            <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/harvest/1920/1080')] bg-cover bg-center" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black text-white italic leading-tight">নতুন কালেকশনে ১৫% ছাড়!</h2>
               <p className="text-emerald-50/70 text-lg md:text-xl italic font-medium max-w-2xl mx-auto mt-4">নেক্সটজেন আর্লি বার্ড কালেকশন থেকে কেনাকাটা করে বুঝে নিন আপনার বাড়তি পাওনা। অফারটি শুধুমাত্র সীমিত সময়ের জন্য প্রযোজ্য।</p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <Link href="/shop" className="bg-white text-emerald-900 px-12 py-5 rounded-3xl font-black text-lg shadow-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                     <Zap size={20} className="text-amber-500" />
                     এখনই কিনুন
                  </Link>
                  <button className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                     অফার দেখুন
                  </button>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
