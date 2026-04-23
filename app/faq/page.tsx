'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageCircle, Phone, Mail, Search } from 'lucide-react';

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'পণ্যগুলো কি আসলেই ১০০% খাঁটি?',
      a: 'হ্যাঁ, নেক্সটজেন FarmingBD-এর প্রতিটি পণ্য সরাসরি কৃষক বা বিশ্বস্ত উৎস থেকে সংগৃহীত। আমরা নিজস্ব তত্ত্বাবধানে মান নিয়ন্ত্রণ করি এবং কোনো প্রকার ভেজাল বা কেমিক্যাল ব্যবহার করি না।'
    },
    {
      q: 'আমি কিভাবে অর্ডার করতে পারি?',
      a: 'আপনি আমাদের ওয়েবসাইট থেকে আপনার পছন্দের পণ্যটি কার্টে যোগ করে চেকআউট করতে পারেন। এছাড়াও আমাদের ফেসবুক পেইজে ইনবক্স করে অথবা সরাসরি আমাদের হেল্পলাইন নম্বরে কল করে অর্ডার করতে পারেন।'
    },
    {
      q: 'ডেলিভারি চার্জ কত?',
      a: 'ঢাকার ভেতরে ডেলিভারি চার্জ ৭০ টাকা এবং ঢাকার বাইরে ১৫০ টাকা। তবে ১০০০০ টাকার উপরে কেনাকাটায় সারা বাংলাদেশে ফ্রি ডেলিভারি সুবিধা রয়েছে।'
    },
    {
      q: 'পণ্য হাতে পেতে কত সময় লাগে?',
      a: 'ঢাকার ভেতরে অর্ডারের ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে আমরা ডেলিভারি নিশ্চিত করি।'
    },
    {
      q: 'ক্যাশ অন ডেলিভারি কি পাওয়া যাবে?',
      a: 'হ্যাঁ, আমরা সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা প্রদান করি। পণ্য হাতে পেয়ে টাকা পরিশোধ করার সুযোগ রয়েছে।'
    },
    {
      q: 'পণ্য পছন্দ না হলে কি রিটার্ন করা সম্ভব?',
      a: 'অবশ্যই! পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে আপনি রিটার্ন করতে পারেন যদি পণ্যে কোনো ত্রুটি থাকে। বিস্তারিত জানতে আমাদের রিটার্ন পলিসি পেইজটি দেখুন।'
    },
    {
      q: 'পাইকারি বা বেশি পরিমাণে নিতে চাইলে কি ডিসকাউন্ট আছে?',
      a: 'হ্যাঁ, যারা নিয়মিত বা বেশি পরিমানে পণ্য নিতে চান তাদের জন্য আমাদের স্পেশাল প্যাকেজ রয়েছে। বিস্তারিত জানতে আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Got Questions?
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight"
          >
            সাধারণ <span className="text-emerald-300">জিজ্ঞাসা</span>
          </motion.h1>
          
          <div className="max-w-2xl mx-auto mt-10 relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300/50" size={20} />
             <input 
               type="text" 
               placeholder="আপনার যা জানার আছে এখানে লিখুন..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/10 border-2 border-white/20 rounded-3xl py-5 pl-16 pr-8 text-white placeholder:text-white/40 outline-none focus:border-emerald-300/50 transition-all font-medium italic backdrop-blur-md"
             />
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-20 max-w-4xl mx-auto px-8">
         <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] border border-emerald-50 shadow-sm overflow-hidden"
              >
                 <button 
                   onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                   className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                          <HelpCircle size={20} />
                       </div>
                       <h3 className="text-lg md:text-xl font-black text-brand-green-dark italic leading-tight">{faq.q}</h3>
                    </div>
                    <ChevronDown 
                      size={24} 
                      className={`text-slate-300 transition-transform duration-500 ${activeIndex === i ? 'rotate-180 text-brand-green' : ''}`} 
                    />
                 </button>
                 
                 <AnimatePresence>
                    {activeIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                         <div className="px-8 pb-8 md:px-20 md:pb-10 pt-0 text-slate-500 italic leading-relaxed font-medium text-lg border-t border-slate-50">
                            {faq.a}
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 italic">দুঃখিত, আপনার সার্চের সাথে মিল রয়েছে এমন কোনো প্রশ্ন পাওয়া যায়নি।</p>
              </div>
            )}
         </div>

         {/* Support Section */}
         <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm text-center space-y-4 group">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green mx-auto group-hover:scale-110 transition-transform">
                  <Phone size={24} />
               </div>
               <h4 className="font-black text-brand-green-dark">সরাসরি কল করুন</h4>
               <p className="text-2xl font-black text-brand-green italic tracking-tighter cursor-pointer">+৮৮০ ১৬১১-১৩৩৩৬৫</p>
            </div>
            <div className="bg-brand-green text-white p-8 rounded-[3rem] shadow-xl shadow-brand-green/20 text-center space-y-4 group">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                  <MessageCircle size={24} />
               </div>
               <h4 className="font-black">ফেসবুক ইনবক্স</h4>
               <button className="bg-white text-brand-green-dark px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">
                  Chat Now
               </button>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-emerald-50 shadow-sm text-center space-y-4 group">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green mx-auto group-hover:scale-110 transition-transform">
                  <Mail size={24} />
               </div>
               <h4 className="font-black text-brand-green-dark">ইমেইল সাপোর্ট</h4>
               <p className="text-slate-500 font-bold italic text-sm truncate">info@nextgenfarmingbd.com</p>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
