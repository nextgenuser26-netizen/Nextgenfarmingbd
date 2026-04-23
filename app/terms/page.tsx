'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, Scale, AlertCircle, Clock, Info } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: '১. ভূমিকা',
      icon: <Info className="text-brand-green" />,
      content: 'নেক্সটজেন FarmingBD-এ আপনাকে স্বাগতম। আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি আমাদের এই শর্তাবলী মেনে নিচ্ছেন বলে গণ্য হবে। অনুগ্রহ করে পণ্য কেনার আগে শর্তাবলী মনযোগ দিয়ে পড়ুন।'
    },
    {
      title: '২. অর্ডার প্রক্রিয়া',
      icon: <Clock className="text-brand-green" />,
      content: 'অর্ডার করার সময় অবশ্যই সঠিক নাম, ঠিকানা এবং ফোন নম্বর প্রদান করতে হবে। আমরা আপনার অর্ডার যাচাই করার জন্য ফোন করতে পারি। যেকোনো ভুল তথ্যের জন্য অর্ডার বাতিল করার অধিকার আমরা রাখি।'
    },
    {
      title: '৩. পণ্য ও মূল্য',
      icon: <Scale className="text-brand-green" />,
      content: 'ওয়েবসাইটে প্রদর্শিত পণ্যের মূল্য যেকোনো সময় পরিবর্তনযোগ্য। তবে আপনি অর্ডার করার সময় যে মূল্য দেখবেন, সেই মূল্যই কার্যকর থাকবে। স্টক শেষ হয়ে গেলে অর্ডার বাতিল হতে পারে।'
    },
    {
      title: '৪. ডেলিভারি ও শিপিং',
      icon: <FileText className="text-brand-green" />,
      content: 'আমরা সাধারণত ২-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন করি। তবে অনিবার্য কারণে (যেমনঃ আবহাওয়া, রাজনৈতিক অস্থিরতা) ডেলিভারি দেরি হতে পারে।'
    },
    {
      title: '৫. ক্যাশ অন ডেলিভারি',
      icon: <ShieldCheck className="text-brand-green" />,
      content: 'বর্তমানে আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা দিচ্ছি। পণ্য বুঝে পাওয়ার সময় আপনাকে বিল পরিশোধ করতে হবে।'
    },
    {
      title: '৬. গোপনীয়তা',
      icon: <ShieldCheck className="text-brand-green" />,
      content: 'আপনার প্রদানকৃত সকল ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ থাকবে। আপনার তথ্য আমরা অন্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না।'
    },
    {
      title: '৭. পরিবর্তনের অধিকার',
      icon: <AlertCircle className="text-brand-green" />,
      content: 'নেক্সটজেন FarmingBD যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। পরিবর্তনের পর ওয়েবসাইট ব্যবহারের অর্থ হলো আপনি নতুন শর্তাবলীতে সম্মতি দিয়েছেন।'
    }
  ];

  return (
    <main className="min-h-screen bg-[#fdfcf0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-brand-green-dark py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/leaves/1920/1080')] opacity-5 mix-blend-overlay scale-110" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/10 px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-widest mb-6"
          >
            Rules & Regulations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 tracking-tight"
          >
            শর্তাবলী (Terms & Conditions)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/70 text-lg md:text-xl font-medium italic"
          >
            নেক্সটজেন FarmingBD ব্যবহার করার নিয়মাবলী এবং নির্দেশিকা।
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-xl shadow-brand-green/5 border border-emerald-50 p-8 md:p-16 space-y-12">
            
            <div className="prose prose-emerald max-w-none">
              <p className="text-slate-600 leading-relaxed text-lg italic mb-12 border-l-4 border-brand-green pl-6 py-2 bg-emerald-50/50 rounded-r-2xl">
                নেক্সটজেন FarmingBD একটি বিশ্বস্ত অনলাইন শপ যা ক্রেতাদের সরাসরি কৃষকের মাঠ থেকে উৎপাদিত নিরাপদ এবং খাঁটি পণ্য সরবারাহ করে থাকে। এই প্ল্যাটফর্মটি যথাযথ ব্যবহারের জন্য আমরা কিছু নীতিমালা নির্ধারণ করেছি।
              </p>

              <div className="grid gap-10">
                {sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-black text-brand-green-dark italic">{section.title}</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium pl-16">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-emerald-50 text-center">
              <p className="text-slate-400 text-sm font-bold italic">
                সর্বশেষ আপডেট: মে ২০২৪
              </p>
              <p className="text-slate-500 mt-4 font-medium">
                যেকোনো প্রয়োজনে আমাদের সাথে <a href="/contact" className="text-brand-green hover:underline">যোগাযোগ করুন</a>।
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
