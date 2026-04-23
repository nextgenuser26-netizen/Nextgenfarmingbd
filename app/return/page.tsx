'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { RefreshCw, ShieldCheck, Heart, AlertCircle, ShoppingBag, Truck, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  const policies = [
    {
      title: '৭ দিনের সহজ রিটার্ন',
      icon: <Calendar size={24} />,
      content: 'পণ্য পাওয়ার ৭ দিনের মধ্যে আপনি চাইলে পণ্য রিটার্ন করতে পারেন। যদি পণ্যে কোনো ত্রুটি থাকে বা ভুল পণ্য পান, তবে আমরা তা বিনাশর্তে ফেরত নেব।'
    },
    {
      title: 'রিটার্নের শর্তাবলী',
      icon: <AlertCircle size={24} />,
      content: 'পণ্যটি অরিজিনাল প্যাকেজিং সহ থাকতে হবে। কোনো প্রকার ব্যবহারের চিহ্ন বা ট্যাগ ছেড়া থাকলে তা রিটার্ন যোগ্য বলে বিবেচিত হবে না। খাদ্যদ্রব্যের ক্ষেত্রে সিল খোলা থাকলে বিশেষ কারণ ছাড়া রিটার্ন গ্রহণ করা হয় না।'
    },
    {
      title: 'খাবার পণ্যের গ্যারান্টি',
      icon: <Heart size={24} />,
      content: 'আমাদের পণ্যে ভেজাল পেলে আমরা ১০০% টাকা ফেরত দেওয়ার নিশ্চয়তা দিই। সেক্ষেত্রে পণ্যের গুণগত মান নিয়ে আমাদের সাপোর্ট টিমে অভিযোগ জানাতে হবে।'
    },
    {
      title: 'রিফান্ড পদ্ধতি',
      icon: <RefreshCw size={24} />,
      content: 'রিটার্ন রিকোয়েস্ট অ্যাপ্রুভ হওয়ার পর ৩-৫ কার্যদিবসের মধ্যে আপনার অরিজিনাল পেমেন্ট মেথড (বিকাশ/নগদ/ব্যাংক) বা আপনার ওয়ালেটে টাকা পৌঁছে যাবে।'
    }
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
            Our Guarantee
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight"
          >
            রিটার্ন <span className="text-emerald-300">পলিসি</span>
            <div className="text-xl md:text-2xl mt-4 opacity-50 font-medium not-italic">(রিফান্ড পলিসি)</div>
          </motion.h1>
          <p className="text-emerald-50/70 text-lg italic font-medium max-w-xl mx-auto">
            আমরা আপনার সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। পণ্য নিয়ে সন্তুষ্ট না হলে সহজেই ফেরত দিন।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-5xl mx-auto px-8">
         <div className="grid md:grid-cols-2 gap-8">
            {policies.map((policy, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm hover:shadow-xl transition-all group"
              >
                 <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
                    {policy.icon}
                 </div>
                 <h3 className="text-2xl font-black text-brand-green-dark italic mb-6">{policy.title}</h3>
                 <p className="text-slate-500 italic text-lg leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {policy.content}
                 </p>
              </motion.div>
            ))}
         </div>

         {/* Call to Action Container */}
         <div className="mt-20 bg-white p-12 rounded-[4rem] border border-emerald-50 shadow-xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-brand-green">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-brand-green-dark italic">রিটার্ন করতে চান?</h3>
               </div>
               <p className="text-slate-500 italic text-lg font-medium leading-relaxed">
                  যদি আপনার অর্ডারে কোনো সমস্যা থেকে থাকে তবে এখনই আমাদের সাপোর্ট সেন্টারে যোগাযোগ করুন। আমরা বিষয়টি দ্রুত সমাধানের ব্যবস্থা করব।
               </p>
               <div className="flex gap-4">
                  <Link href="/contact" className="bg-brand-green text-white px-10 py-4 rounded-3xl font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
                     যোগাযোগ করুন
                  </Link>
                  <Link href="/track-order" className="bg-emerald-50 text-brand-green-dark px-10 py-4 rounded-3xl font-black text-sm hover:bg-emerald-100 transition-all">
                     অর্ডার ট্র্যাক করুন
                  </Link>
               </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square relative bg-brand-bg rounded-[3rem] overflow-hidden">
               <div className="absolute inset-4 border-2 border-dashed border-emerald-200 rounded-[2rem] flex flex-col items-center justify-center text-emerald-200">
                  <ShoppingBag size={64} className="mb-4 opacity-50" />
                  <Truck size={48} className="opacity-20 translate-x-12" />
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
