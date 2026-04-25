'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronDown, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const faqs = [
  {
    question: 'পণ্য পছন্দ না হলে কি রিটার্ন করা যাবে?',
    answer: 'অবশ্যই! আমাদের প্রতিটি পণ্যে ১০০% ক্যাশব্যাক গ্যারান্টি আছে। যদি আপনি গুণগত মান নিয়ে অসন্তুষ্ট হন, তবে পণ্য পাওয়ার ৩ দিনের মধ্যে আমাদের জানালে আমরা টাকা ফেরত দেব।'
  },
  {
    question: 'অর্ডার করার কতদিন পর পণ্য পাবো?',
    answer: 'ঢাকার ভেতরে সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।'
  },
  {
    question: 'পেমেন্ট মেথড কি কি?',
    answer: 'আমরা ক্যাশ অন ডেলিভারি (Cash on Delivery), বিকাশ, এবং রকেট পেমেন্ট সাপোর্ট করি।'
  }
];

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Dynamic shipping FAQ
  const shippingFaq = {
    question: 'আপনাদের ডেলিভারি চার্জ কত?',
    answer: `ঢাকার ভেতরে ডেলিভারি চার্জ ৳${settings?.shippingCostInsideDhaka || 60} টাকা এবং ঢাকার বাইরে ৳${settings?.shippingCostOutsideDhaka || 150} টাকা। তবে ৳${settings?.freeShippingThreshold || 5000} টাকার বেশি অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!`
  };

  const allFaqs = settings ? [shippingFaq, ...faqs] : faqs;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('আপনার বার্তা সফলভাবে পাঠানো হয়েছে!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error('বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error('বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <Header />
      
      {/* Clean Hero */}
      <section className="py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-emerald-50 text-brand-green font-black text-[10px] uppercase tracking-[0.3em] px-4 md:px-6 py-2 rounded-full mb-4 md:mb-6"
          >
            Connect With Us
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-brand-green-dark tracking-tighter italic mb-4 md:mb-8"
          >
            কথা বলুন <span className="text-brand-green">আমাদের সাথে</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 italic text-sm md:text-lg lg:text-xl font-medium leading-relaxed px-4"
          >
            ভেজালের ভিড়ে খাঁটি পণ্য খুঁজে পাওয়া আপনার অধিকার। আমাদের পণ্যের মান নিয়ে কোনো প্রশ্ন বা পরামর্শ থাকলে আজই জানান।
          </motion.p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 md:py-16 lg:py-24 max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">

          {/* Simple Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-10 lg:p-16 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] border border-slate-100 shadow-2xl shadow-emerald-900/[0.03] space-y-8 md:space-y-12"
          >
            <div className="space-y-4">
               <h2 className="text-3xl font-black text-brand-green-dark italic">মেসেজ পাঠান</h2>
               <p className="text-slate-400 font-medium italic text-sm">আমরা সাধারণত ২-৪ ঘণ্টার মধ্যে আপনার উত্তর দেওয়ার চেষ্টা করি।</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার নাম</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                    placeholder="উদা: রকিবুল হাসান"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার ইমেইল</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                    placeholder="উদা: example@email.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার ফোন</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                  placeholder="উদা: +৮৮০ ১৬১১-১৩৩৩৬৫"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">বিষয়</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm focus:border-brand-green outline-none transition-all"
                  placeholder="বিষয় লিখুন..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার বার্তা</label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50/50 border-2 border-slate-50 rounded-[2rem] py-4 px-6 text-sm focus:border-brand-green outline-none transition-all resize-none"
                  placeholder="বিস্তারিত এখানে লিখুন..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-green-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-green transition-all shadow-xl shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'পাঠানো হচ্ছে...' : 'Submit'} <Send size={20} />
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Features */}
          <div className="space-y-16">
            
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
               <motion.div
                 whileHover={{ y: -5 }}
                 className="p-6 md:p-8 lg:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 shadow-sm space-y-3 md:space-y-4"
               >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-green">
                    <Phone size={24} />
                  </div>
                  <h4 className="font-black text-brand-green-dark italic text-sm md:text-base">হটলাইন</h4>
                  <p className="text-slate-500 font-bold italic text-xs md:text-sm break-all">{settings?.contactPhone || '+৮৮০ ১৬১১-১৩৩৩৬৫'}</p>
               </motion.div>

               <motion.div
                 whileHover={{ y: -5 }}
                 className="p-6 md:p-8 lg:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 shadow-sm space-y-3 md:space-y-4"
               >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Mail size={24} />
                  </div>
                  <h4 className="font-black text-brand-green-dark italic text-sm md:text-base">ইমেইল</h4>
                  <p className="text-slate-500 font-bold italic text-xs md:text-sm break-all">{settings?.contactEmail || 'info@nextgenfarmingbd.com'}</p>
               </motion.div>

               <motion.div
                 whileHover={{ y: -5 }}
                 className="p-6 md:p-8 lg:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 shadow-sm space-y-3 md:space-y-4"
               >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                    <MapPin size={24} />
                  </div>
                  <h4 className="font-black text-brand-green-dark italic text-sm md:text-base">অফিস</h4>
                  <p className="text-slate-500 font-bold italic text-xs md:text-sm leading-relaxed">{settings?.contactAddress || 'Metro Housing, Mohammadpur, Dhaka'}</p>
               </motion.div>

               <motion.div
                 whileHover={{ y: -5 }}
                 className="p-6 md:p-8 lg:p-10 bg-brand-green-dark rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] shadow-xl text-white space-y-3 md:space-y-4"
               >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-300">
                    <MessageCircle size={24} />
                  </div>
                  <h4 className="font-black italic text-sm md:text-base">লাইভ চ্যাট</h4>
                  <p className="text-emerald-50/70 text-[10px] md:text-xs font-medium italic leading-relaxed">সহজেই চ্যাট করুন হোয়াটসঅ্যাপ-এ</p>
               </motion.div>
            </div>

            {/* Social Connect Widget */}
            <div className="bg-white p-6 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
               <div className="space-y-1">
                 <h4 className="text-lg md:text-xl font-black text-brand-green-dark italic">সোশ্যাল কানেক্ট</h4>
                 <p className="text-slate-400 text-[10px] md:text-xs italic">আমাদের আপডেটগুলো পেতে যুক্ত থাকুন</p>
               </div>
               <div className="flex gap-3 md:gap-4">
                  {settings?.socialFacebook && (
                    <motion.a
                      href={settings.socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all"
                    >
                      <Facebook size={24} />
                    </motion.a>
                  )}
                  {settings?.socialInstagram && (
                    <motion.a
                      href={settings.socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 md:w-14 md:h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all"
                    >
                      <Instagram size={24} />
                    </motion.a>
                  )}
                  {settings?.socialYoutube && (
                    <motion.a
                      href={settings.socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 md:w-14 md:h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all"
                    >
                      <Youtube size={24} />
                    </motion.a>
                  )}

               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Simple Map Layout */}
      <section className="py-12 md:py-16 lg:py-24 max-w-7xl mx-auto px-4 md:px-8">
         <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden group shadow-2xl border-4 md:border-8 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116833.8318789547!2d90.337288078125!3d23.780887499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0adcd59d18b%3A0xc34185794954483d!2sMirpur%20Circle%2010%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1703058866380!5m2!1sen!2sbd"
              className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 border-none"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-4 md:top-6 lg:top-10 left-4 md:left-6 lg:left-10 bg-white/90 backdrop-blur-md p-4 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] shadow-xl border border-white/50 max-w-[200px] md:max-w-[240px] lg:max-w-[280px] pointer-events-none">
               <h4 className="text-base md:text-lg lg:text-xl font-black text-brand-green-dark mb-2 md:mb-4 italic">হেড অফিস</h4>
               <p className="text-slate-500 text-[10px] md:text-xs lg:text-sm font-medium italic leading-relaxed line-clamp-3 md:line-clamp-none">{settings?.contactAddress || 'Metro Housing, Block-C, Main Road, H#03, Mohammadpur, Dhaka-1207.'}</p>
               <div className="pt-2 md:pt-4 flex items-center gap-2 text-brand-green font-black text-[10px] md:text-xs uppercase tracking-widest">
                  <Clock size={16} /> ৯টা - ৬টা (শনি - বৃহস্পতি)
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-brand-green-dark italic">সাধারণ জিজ্ঞাসা (FAQ)</h2>
            <p className="text-slate-400 text-sm md:text-base italic">যোগাযোগ করার আগে নিচের প্রশ্নোত্তরগুলো দেখে নিতে পারেন।</p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {allFaqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl md:rounded-3xl overflow-hidden bg-[#fafbfc]">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between text-left group"
                >
                  <span className={`text-sm md:text-base lg:text-lg font-black italic transition-colors ${activeFaq === i ? 'text-brand-green' : 'text-slate-700 group-hover:text-brand-green'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`text-brand-green transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-8 text-slate-500 text-sm md:text-base font-medium italic leading-relaxed border-t border-slate-50 pt-3 md:pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
