'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, Info, Bell, ShieldAlert } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'তথ্য সংগ্রহ',
      icon: <Eye size={20} />,
      content: 'আমরা যখন আপনি আমাদের ওয়েবসাইটে অর্ডার করেন বা একাউন্ট খোলেন, তখন আপনার নাম, ইমেইল এড্রেস, ফোন নম্বর এবং ডেলিভারি এড্রেস সংগ্রহ করি। এছাড়াও ব্রাউজিং ডাটা হিসেবে আইপি এড্রেস এবং কুকিজের মাধ্যমে কিছু তথ্য সংগৃহীত হতে পারে যা আমরা আমাদের সার্ভিসের মানোন্নয়নে ব্যবহার করি।'
    },
    {
      title: 'তথ্যের ব্যবহার',
      icon: <Info size={20} />,
      content: 'আপনার অর্ডারের প্রসেসিং, ডেলিভারি নিশ্চিতকরণ এবং কাস্টমার সাপোর্ট প্রদানের জন্য এই কারিগরী তথ্য ব্যবহৃত হয়। এছাড়াও আমরা আপনাকে বিশেষ অফার, আপডেট এবং নিউজলেটার পাঠানোর জন্য আপনার ইমেইল বা ফোন নম্বর ব্যবহার করতে পারি (যদি আপনি সম্মতি প্রদান করেন)।'
    },
    {
      title: 'তথ্য সুরক্ষা',
      icon: <Lock size={20} />,
      content: 'আপনার তথ্যের শতভাগ নিরাপত্তা নিশ্চিত করতে আমরা আধুনিক এনক্রিপশন প্রযুক্তি এবং সিকিউরিটি প্রোটোকল ব্যবহার করি। আপনার পেমেন্ট গেটওয়ে সংক্রান্ত তথ্য সরাসরি এনক্রিপ্টেড চ্যানেলের মাধ্যমে প্রসেস করা হয় এবং আমরা কোনো কার্ড ডিটেইলস আমাদের সার্ভারে সংরক্ষণ করি না।'
    },
    {
      title: 'তৃতীয় পক্ষের সাথে শেয়ারিং',
      icon: <ShieldAlert size={20} />,
      content: 'আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়া দেই না। তবে ডেলিভারি পার্টনার (কুরিয়ার কোম্পানি) এবং পেমেন্ট গেটওয়রের কাছে প্রয়োজনীয় তথ্য (নাম, ঠিকানা ও ফোন নম্বর) শেয়ার করা হয় শুধুমাত্র সার্ভিসটি সম্পন্ন করার উদ্দেশ্যে।'
    },
    {
      title: 'কুকিজ পলিসি',
      icon: <Bell size={20} />,
      content: 'আমাদের ওয়েবসাইটটি আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করে। কুকিজ হলো ছোট ছোট টেক্সট ফাইল যা আপনার ডিভাইসে সংরক্ষিত থাকে। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ ডিজএবল করে রাখতে পারেন, তবে এতে ওয়েবসাইটের কিছু ফিচারে সমস্যা হতে পারে।'
    }
  ];

  return (
    <main className="min-h-screen bg-brand-bg pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-brand-green-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#000]/20 opacity-30" />
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-[0.2em] mb-6"
          >
            Trust & Security
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight"
          >
            প্রাইভেসি <span className="text-emerald-300">পলিসি</span>
            <div className="text-xl md:text-2xl mt-4 opacity-50 font-medium not-italic">(গোপনীয়তা নীতি)</div>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/70 text-lg md:text-xl max-w-2xl mx-auto italic font-medium"
          >
            আপনার তথ্যের সুরক্ষা আমাদের প্রধান অগ্রাধিকার। নেক্সটজেন FarmingBD কীভাবে আপনার ডাটা সংগ্রহ ও ব্যবহার করে তা এখানে বিস্তারিত আলোচনা করা হলো।
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 max-w-4xl mx-auto px-8">
         <div className="space-y-12">
            <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm mb-12">
               <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-brand-green">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h4 className="font-black text-brand-green-dark">Last Updated: April 2026</h4>
                  <p className="text-slate-400 text-xs italic font-bold">Version 1.2</p>
               </div>
            </div>

            {sections.map((section, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 md:p-12 bg-white rounded-[3rem] border border-emerald-50 hover:shadow-xl transition-all"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                       {section.icon}
                    </div>
                    <h3 className="text-2xl font-black text-brand-green-dark italic">{section.title}</h3>
                 </div>
                 <p className="text-slate-600 leading-relaxed italic text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {section.content}
                 </p>
              </motion.div>
            ))}

            <div className="bg-[#f0ede4] p-10 rounded-[3rem] text-center space-y-6">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-green mx-auto shadow-sm">
                  <Bell size={28} />
               </div>
               <h3 className="text-2xl font-black text-slate-700 italic">নীতির পরিবর্তন</h3>
               <p className="text-slate-500 italic max-w-xl mx-auto">নেক্সটজেন FarmingBD যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। যেকোনো বড় ধরনের পরিবর্তন হলে আমরা আপনাকে নোটিশের মাধ্যমে জানিয়ে দেব।</p>
            </div>

            <div className="text-center py-10">
               <p className="text-slate-400 italic mb-6">আপনার যদি কোনো প্রশ্ন থাকে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।</p>
               <div className="flex justify-center gap-4">
                  <button className="bg-brand-green text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
                    Contact Support
                  </button>
                  <button className="bg-white text-brand-green-dark border border-emerald-100 px-8 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all">
                    Terms of Service
                  </button>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
