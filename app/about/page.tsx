'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Target, Heart, ShieldCheck, Leaf, Truck, Users, Award, Sprout, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-bg pb-0">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="bg-brand-green-dark py-20 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
        
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-[0.3em] mb-8"
          >
            Since 2021
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white italic mb-10 leading-tight"
          >
            বিশুদ্ধতার সাথে আমাদের <span className="text-emerald-300">ঐতিহাসিক যাত্রা</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium italic"
          >
            নেক্সটজেন FarmingBD এর লক্ষ্য হলো ভেজালের ভিড়ে আপনাদের কাছে ১০০% খাঁটি ও গুণগত সম্পন্ন প্রাকৃতিক খাদ্য পৌঁছে দেওয়া।
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="relative h-[600px] w-full">
               <Image 
                  src="https://picsum.photos/seed/farming-story/1000/1200" 
                  alt="Our Sourcing Journey" 
                  fill
                  className="rounded-[4rem] object-cover shadow-2xl skew-y-1"
                  referrerPolicy="no-referrer"
                />
             </div>
             {/* Float Card */}
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="absolute -bottom-10 -right-4 md:-right-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-50 max-w-[280px]"
             >
                <p className="text-brand-green font-black text-5xl mb-2 tracking-tighter">৫,০০০+</p>
                <p className="text-slate-800 font-black italic text-sm">সন্তুষ্ট গ্রাহকের ভালোবাসা</p>
                <div className="w-12 h-1 bg-brand-green mt-4 rounded-full" />
             </motion.div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-brand-green font-black text-xs uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-green-dark italic leading-tight">বিশ্বস্ততার ৫ বছর: আমাদের ছোট থেকে বড় হওয়া</h2>
            </div>
            
            <div className="space-y-8 text-slate-500 leading-relaxed text-lg italic font-medium">
              <p>
                আমরা গত ৫ বছর ধরে বাংলাদেশের বিভিন্ন প্রান্ত থেকে খাঁটি পণ্য সংগ্রহ করে আপনাদের চাহিদা মিটিয়ে আসছি। আমাদের যাত্রা শুরু হয়েছিল একটি ক্ষুদ্র স্বপ্ন নিয়ে - &quot;সবাই যেন নিরাপদ খাদ্য পায়।&quot;
              </p>
              <p>
                সুন্দরবনের গহীন জঙ্গল থেকে মধু সংগ্রহ হোক কিংবা গাইবান্ধার চর থেকে আসা খাঁটি দুধের ঘি, প্রতিটি পণ্যের গুণগত মান আমরা নিজেরাই যাচাই করি। আমরা শুধু বিক্রেতা নই, আমরা প্রতিটি পরিবারের স্বাস্থ্যের অংশীদার হতে চাই।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                  <Target size={24} />
                </div>
                <h4 className="font-black text-brand-green-dark">ভিশন</h4>
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed">সারাদেশের প্রতিটি রান্নাঘরে বিশুদ্ধ অর্গানিক পণ্য পৌঁছে দেওয়া।</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Award size={24} />
                </div>
                <h4 className="font-black text-brand-green-dark">কোয়ালিটি</h4>
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed">তৃতীয় পক্ষের পরীক্ষা এবং নিজস্ব বাছাই প্রক্রিয়ায় শতভাগ নিশ্চয়তা।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Process Section */}
      <section className="py-24 bg-brand-green-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/texture/1920/1080')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-white italic capitalize">কিভাবে আমরা আপনার কাছে পৌঁছাই</h2>
             <p className="text-emerald-50/60 text-lg md:text-xl font-medium italic">মাঠ থেকে টেবিল পর্যন্ত আমাদের প্রতিটি ধাপ নিরাপদ</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Step Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-emerald-500/20 border-t-2 border-dashed border-emerald-500/30" />
            
            {[
              { icon: Sprout, title: 'সরাসরি সংগ্রহ', desc: 'কৃষকের জমি থেকে সেরা পণ্যটি আমরা নিজ হাতে বেছে নিই।' },
              { icon: ShieldCheck, title: 'মান যাচাই', desc: 'ল্যাব টেস্ট এবং কঠোর মান নিয়ন্ত্রণের মাধ্যমে বিশুদ্ধতা নিশ্চিত করি।' },
              { icon: Heart, title: 'প্রাকৃতিক প্রসেসিং', desc: 'কোনো কেমিক্যাল ছাড়াই ঘরোয়া পদ্ধতিতে প্যাকেটজাত করি।' },
              { icon: Truck, title: 'দ্রুত ডেলিভারি', desc: 'অর্ডার করার ৪৮-৭২ ঘণ্টার মধ্যে নিরাপদ ডেলিভারি।' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6 group">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-brand-green shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform">
                  <step.icon size={36} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white italic">{step.title}</h4>
                  <p className="text-emerald-50/50 text-sm font-medium italic">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="text-center space-y-2">
                <h3 className="text-5xl md:text-6xl font-black text-brand-green-dark tracking-tighter">৫০০+</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">রেগুলার কৃষক</p>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-5xl md:text-6xl font-black text-brand-green-dark tracking-tighter">১২০+</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">প্রিমিয়াম পণ্য</p>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-5xl md:text-6xl font-black text-brand-green-dark tracking-tighter">৬৪</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">জেলা ডেলিভারি</p>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-5xl md:text-6xl font-black text-brand-green-dark tracking-tighter">৯৯%</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">পজিটিভ রিভিউ</p>
              </div>
           </div>
        </div>
      </section>

      {/* Values Redesign */}
      <section className="py-24 bg-brand-bg border-y border-emerald-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
               <h2 className="text-3xl md:text-5xl font-black text-brand-green-dark italic">Why Choose Us?</h2>
               <p className="text-slate-500 font-medium italic">কেন হাজারো মানুষ নেক্সটজেন FarmingBD-কে বেছে নিয়েছেন?</p>
            </div>
            <Link href="/shop" className="text-brand-green font-black italic hover:underline flex items-center gap-2">
              Shop Now <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: '১০০% ক্যাশব্যাক', desc: 'পণ্যে সামান্যতম ভেজাল পেলে আমরা বিনাশর্তে ১০০% টাকা ফেরত দেওয়ার নিশ্চয়তা দিই।' },
              { icon: Leaf, title: 'সরাসরি উৎস থেকে', desc: 'মাঠ থেকে সরাসরি পণ্য সংগ্রহ করা হয়, ফলে প্রতিটি দানা থাকে তাজা ও পুষ্টিকর।' },
              { icon: Users, title: 'কমিউনিটি সাপোর্ট', desc: 'আমরা স্থানীয় কৃষকদের ন্যায্য মূল্য প্রদান করি এবং গ্রামীণ অর্থনীতিতে অবদান রাখি।' }
            ].map((val, i) => (
              <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-emerald-50 hover:shadow-2xl hover:shadow-brand-green/5 transition-all group">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-white transition-colors">
                  <val.icon size={32} />
                </div>
                <h4 className="text-2xl font-black text-brand-green-dark mb-4 italic">{val.title}</h4>
                <p className="text-slate-500 italic text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto bg-brand-green-dark rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
           <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/patterns/1920/1080')] opacity-5 mix-blend-overlay" />
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
           
           <div className="relative z-10 space-y-8 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-black text-white italic leading-tight">শুদ্ধ জীবনের পথে<br />এক ধাপ এগিয়ে যান</h2>
              <p className="text-emerald-50/70 text-lg italic font-medium">আজই আমাদের প্রিমিয়াম অর্গানিক পণ্যের স্বাদ নিন এবং আপনার পরিবারকে দিন সেরা পুষ্টির নিশ্চয়তা।</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                 <Link href="/shop" className="bg-white text-emerald-900 px-12 py-5 rounded-3xl font-black text-lg shadow-2xl hover:bg-emerald-50 transition-all">
                    Shop Now
                 </Link>
                 <Link href="/contact" className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-white/10 transition-all">
                    Contact Us
                 </Link>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
