'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Calendar, Tag, Percent, Clock, Loader2, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface Deal {
  _id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y';
  discountValue: number;
  products?: string[];
  categories?: string[];
  startDate: string;
  endDate: string;
  minOrderValue?: number;
  maxUses?: number;
  code?: string;
  isActive: boolean;
  createdAt: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [allPagesBanner, setAllPagesBanner] = useState<any>(null);

  useEffect(() => {
    fetchDeals();
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

  const fetchDeals = async () => {
    try {
      console.log('Fetching deals from API...');
      const res = await fetch('/api/deals?limit=50');
      console.log('API response status:', res.status);
      const data = await res.json();
      console.log('API response data:', data);
      console.log('Deals array:', data.deals);
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleUseCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    localStorage.setItem('pendingCoupon', code);
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 500);
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();
  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();

  const activeDeals = deals.filter(deal => !isExpired(deal.endDate) && !isUpcoming(deal.startDate) && deal.isActive);
  const expiredDeals = deals.filter(deal => isExpired(deal.endDate));
  const upcomingDeals = deals.filter(deal => isUpcoming(deal.startDate));

  console.log('Deals state:', deals);
  console.log('Active deals count:', activeDeals.length);
  console.log('Expired deals count:', expiredDeals.length);
  console.log('Upcoming deals count:', upcomingDeals.length);

  // Log each deal's details to understand filtering
  deals.forEach((deal, index) => {
    console.log(`Deal ${index + 1}:`, {
      title: deal.title,
      startDate: deal.startDate,
      endDate: deal.endDate,
      isActive: deal.isActive,
      isExpired: isExpired(deal.endDate),
      isUpcoming: isUpcoming(deal.startDate),
      now: new Date().toISOString()
    });
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfdfa]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa]">
      <Header />
      
      {/* Header */}
      {allPagesBanner ? (
        <Link href={allPagesBanner.link || '/deals'} className="block w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-slate-100 mb-8 relative overflow-hidden">
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
          <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-white italic">
              বিশেষ <span className="text-emerald-300">অফার</span> ও ছাড়
            </h1>
            <p className="text-emerald-50/70 text-lg italic">
              সেরা পণ্যের উপর বিশেষ ছাড় এবং অফার উপভোগ করুন
            </p>
          </div>
        </section>
      )}

      {/* Active Deals */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-black text-brand-green-dark italic mb-8 flex items-center gap-3">
          <Tag className="text-brand-green" /> চলমান অফার
        </h2>
        {activeDeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 italic">বর্তমানে কোনো সক্রিয় অফার নেই</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeDeals.map((deal) => (
              <motion.div
                key={deal._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[3rem] overflow-hidden border border-emerald-50 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="bg-gradient-to-br from-brand-green to-emerald-600 p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      {deal.discountType === 'percentage' ? (
                        <Percent className="w-8 h-8" />
                      ) : (
                        <Tag className="w-8 h-8" />
                      )}
                    </div>
                    {deal.code && (
                      <span className="bg-white text-brand-green font-black px-4 py-2 rounded-xl text-sm">
                        {deal.code}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black italic mb-2">{deal.title}</h3>
                  <div className="text-4xl font-black">
                    {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `৳${deal.discountValue}`}
                    <span className="text-lg font-normal"> ছাড়</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-slate-600 italic">{deal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                    </div>
                  </div>
                  {deal.minOrderValue && (
                    <p className="text-sm text-slate-500">
                      মিনিমাম অর্ডার: ৳{deal.minOrderValue}
                    </p>
                  )}
                  {deal.categories && deal.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {deal.categories.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-brand-green text-xs font-black rounded-lg">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {deal.code && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="font-black text-brand-green">{deal.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(deal.code!)}
                          className="text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          {copiedCoupon === deal.code ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseCoupon(deal.code!)}
                        className="bg-brand-green text-white px-4 py-3 rounded-xl font-black text-sm hover:bg-brand-green-dark transition-colors"
                      >
                        ব্যবহার করুন
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* No deals at all */}
      {deals.length === 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <div className="text-center py-16 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 italic">বর্তমানে কোনো অফার নেই</p>
          </div>
        </section>
      )}

      {/* All Deals Fallback - Show deals that don't fit any category */}
      {deals.length > 0 && activeDeals.length === 0 && expiredDeals.length === 0 && upcomingDeals.length === 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-brand-green-dark italic mb-8 flex items-center gap-3">
            <Tag className="text-brand-green" /> সকল অফার
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <motion.div
                key={deal._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[3rem] overflow-hidden border border-emerald-50 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="bg-gradient-to-br from-brand-green to-emerald-600 p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      {deal.discountType === 'percentage' ? (
                        <Percent className="w-8 h-8" />
                      ) : (
                        <Tag className="w-8 h-8" />
                      )}
                    </div>
                    {deal.code && (
                      <span className="bg-white text-brand-green font-black px-4 py-2 rounded-xl text-sm">
                        {deal.code}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black italic mb-2">{deal.title}</h3>
                  <div className="text-4xl font-black">
                    {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `৳${deal.discountValue}`}
                    <span className="text-lg font-normal"> ছাড়</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-slate-600 italic">{deal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                    </div>
                  </div>
                  {deal.minOrderValue && (
                    <p className="text-sm text-slate-500">
                      মিনিমাম অর্ডার: ৳{deal.minOrderValue}
                    </p>
                  )}
                  {deal.categories && deal.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {deal.categories.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-brand-green text-xs font-black rounded-lg">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-2">
                    Status: {deal.isActive ? 'Active' : 'Inactive'} | Expired: {isExpired(deal.endDate) ? 'Yes' : 'No'} | Upcoming: {isUpcoming(deal.startDate) ? 'Yes' : 'No'}
                  </div>
                  {deal.code && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="font-black text-brand-green">{deal.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(deal.code!)}
                          className="text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          {copiedCoupon === deal.code ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseCoupon(deal.code!)}
                        className="bg-brand-green text-white px-4 py-3 rounded-xl font-black text-sm hover:bg-brand-green-dark transition-colors"
                      >
                        ব্যবহার করুন
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Deals */}
      {upcomingDeals.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-brand-green-dark italic mb-8 flex items-center gap-3">
            <Clock className="text-brand-green" /> আসন্ন অফার
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingDeals.map((deal) => (
              <motion.div
                key={deal._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-lg opacity-75"
              >
                <div className="bg-slate-100 p-8 text-slate-400">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                      <Clock className="w-8 h-8" />
                    </div>
                    {deal.code && (
                      <span className="bg-slate-200 text-slate-600 font-black px-4 py-2 rounded-xl text-sm">
                        {deal.code}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black italic mb-2">{deal.title}</h3>
                  <div className="text-4xl font-black">
                    {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `৳${deal.discountValue}`}
                    <span className="text-lg font-normal"> ছাড়</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-slate-600 italic">{deal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(deal.startDate)} শুরু হবে
                    </div>
                  </div>
                  {deal.code && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="font-black text-slate-600">{deal.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(deal.code!)}
                          className="text-slate-500 hover:text-slate-600 transition-colors"
                        >
                          {copiedCoupon === deal.code ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseCoupon(deal.code!)}
                        className="bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-black text-sm hover:bg-slate-400 transition-colors"
                      >
                        ব্যবহার করুন
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Expired Deals */}
      {expiredDeals.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-black text-brand-green-dark italic mb-8 flex items-center gap-3">
            <Tag className="text-brand-green" /> শেষ হওয়া অফার
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expiredDeals.map((deal) => (
              <motion.div
                key={deal._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-lg opacity-50"
              >
                <div className="bg-slate-200 p-8 text-slate-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-slate-300 rounded-2xl flex items-center justify-center">
                      <Tag className="w-8 h-8" />
                    </div>
                    {deal.code && (
                      <span className="bg-slate-300 text-slate-600 font-black px-4 py-2 rounded-xl text-sm">
                        {deal.code}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black italic mb-2">{deal.title}</h3>
                  <div className="text-4xl font-black">
                    {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `৳${deal.discountValue}`}
                    <span className="text-lg font-normal"> ছাড়</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-slate-600 italic">{deal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(deal.endDate)} শেষ হয়েছে
                    </div>
                  </div>
                  {deal.code && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between opacity-50">
                        <span className="font-black text-slate-600">{deal.code}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(deal.code!)}
                          className="text-slate-500 hover:text-slate-600 transition-colors"
                        >
                          {copiedCoupon === deal.code ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                      <button
                        disabled
                        className="bg-slate-200 text-slate-500 px-4 py-3 rounded-xl font-black text-sm cursor-not-allowed"
                      >
                        শেষ হয়েছে
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
