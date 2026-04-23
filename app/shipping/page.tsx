'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { Truck, MapPin, Clock, ShieldCheck, Globe, CreditCard } from 'lucide-react';

export default function ShippingPolicyPage() {
  const deliveryRates = [
    { title: 'ঢাকার ভেতরে', rate: '৳৭০', time: '২৪-৪৮ ঘণ্টা' },
    { title: 'ঢাকার বাইরে', rate: '৳১৫০', time: '৩-৫ কার্যদিবস' },
    { title: 'ফ্রি ডেলিভারি', rate: '৳০', time: 'মিনিমাম ১০০০০৳ বাজার' },
  ];

  return (
    <main className="min-h-screen bg-brand-bg pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-brand-green-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-white/10 px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-widest mb-6"
          >
            Safe & Fast Delivery
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight"
          >
            শিপিং <span className="text-emerald-300">পলিসি</span>
          </motion.h1>
          <p className="text-emerald-50/70 text-lg italic font-medium max-w-xl mx-auto">
            আপনার পণ্যটি আমরা অত্যন্ত নিবিড়ভাবে যত্নসহকারে সারা বাংলাদেশে পৌঁছে দিয়ে থাকি।
          </p>
        </div>
      </section>

      {/* Delivery Rates Grid */}
      <section className="py-20 max-w-7xl mx-auto px-8">
         <div className="grid md:grid-cols-3 gap-8">
            {deliveryRates.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm flex flex-col items-center text-center space-y-6 group"
              >
                 <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all">
                    <Truck size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-brand-green-dark italic mb-1">{item.title}</h3>
                    <p className="text-brand-green font-black text-3xl italic tracking-tighter">{item.rate}</p>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-black italic uppercase">
                    <Clock size={14} />
                    <span>{item.time}</span>
                 </div>
              </motion.div>
            ))}
         </div>

         {/* Detailed Sections */}
         <div className="mt-20 grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green">
                        <MapPin size={24} />
                     </div>
                     <h3 className="text-3xl font-black text-brand-green-dark italic">কোথায় ডেলিভারি হয়?</h3>
                  </div>
                  <p className="text-slate-500 italic text-lg leading-relaxed font-medium">আমরা বাংলাদেশের সকল জেলা এবং উপজেলা পর্যায়ে হোম ডেলিভারি প্রদান করে থাকি। কুরিয়ার সার্ভিসের মাধ্যমে আমাদের পার্সেলগুলো আপনার নিকটস্থ ঠিকানায় পৌঁছে দেওয়া হয়।</p>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green">
                        <CreditCard size={24} />
                     </div>
                     <h3 className="text-3xl font-black text-brand-green-dark italic">পেমেন্ট মেথড</h3>
                  </div>
                  <p className="text-slate-500 italic text-lg leading-relaxed font-medium">আমরা ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা প্রদান করি। এছাড়াও আপনি বিকাশ, নগদ বা রকেটের মাধ্যমে অগ্রিম পেমেন্ট করেও অর্ডার সম্পন্ন করতে পারেন।</p>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green">
                        <ShieldCheck size={24} />
                     </div>
                     <h3 className="text-3xl font-black text-brand-green-dark italic">নিরাপদ প্যাকেজিং</h3>
                  </div>
                  <p className="text-slate-500 italic text-lg leading-relaxed font-medium">খাবার পণ্য হওয়ায় আমরা প্যাকেজিংয়ের ক্ষেত্রে অতিরিক্ত সতর্কতা অবলম্বন করি। গ্লাস জার বা লিকুইড পণ্যের ক্ষেত্রে স্পেশাল বাবল র‍্যাপ এবং শক্ত কার্টন ব্যবহার করা হয়।</p>
               </div>
            </div>

            <div className="bg-brand-green-dark rounded-[4rem] p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
               <div className="relative z-10 space-y-8">
                  <Globe size={64} className="text-emerald-300 opacity-50" />
                  <h3 className="text-4xl font-black italic leading-tight">ইন্টারন্যাশনাল শিপিং</h3>
                  <p className="text-emerald-50/70 text-lg font-medium italic">আপাতত আমরা দেশের বাইরে কোনো পণ্য ডেলিভারি দিচ্ছি না। তবে ভবিষ্যতে আমাদের গ্লোবাল শিপিং শুরু হলে আমরা আমাদের ওয়েবসাইট ও সোশ্যাল মিডিয়ায় জানিয়ে দেব।</p>
                  <div className="pt-8 flex flex-col gap-4">
                     <div className="flex items-center gap-4 text-emerald-300">
                        <Globe size={20} />
                        <span className="font-black italic">No International Shipping Yet</span>
                     </div>
                     <div className="flex items-center gap-4 text-emerald-300">
                        <ShieldCheck size={20} />
                        <span className="font-black italic">64 Districts Coverage</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
