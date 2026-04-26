'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryBar from '@/components/CategoryBar';
import BannerCarousel from '@/components/BannerCarousel';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import SEOMetadata from '@/components/SEOMetadata';
import { Truck, ShieldCheck, RefreshCw, Headphones, Flame, Star, Send, PhoneCall, ArrowRight, Quote, Zap, Sparkles, ShoppingBag, Tag, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredBanner, setFeaturedBanner] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsRes, categoriesRes, bannersRes, dealsRes, settingsRes, reviewsRes, seoRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/banners?isActive=true&position=featured-collections'),
          fetch('/api/deals?limit=10'),
          fetch('/api/settings'),
          fetch('/api/reviews?limit=6'),
          fetch('/api/seo?pagePath=/')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const bannersData = await bannersRes.json();
        const dealsData = await dealsRes.json();
        const settingsData = await settingsRes.json();
        const reviewsData = await reviewsRes.json();
        const seoDataArray = await seoRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
        setSettings(settingsData.settings);
        setReviews(reviewsData.reviews || []);
        setSeoData(seoDataArray.length > 0 ? seoDataArray[0] : null);
        console.log('Settings loaded:', settingsData.settings);
        console.log('Banner image:', settingsData.settings?.bannerImage);
        console.log('Ticker messages:', settingsData.settings?.tickerMessages);
        
        const banners = bannersData.banners || [];
        if (banners.length > 0) {
          setFeaturedBanner(banners[0]);
        }

        const activeDeals = (dealsData.deals || []).filter((deal: any) => {
          const now = new Date();
          const startDate = new Date(deal.startDate);
          const endDate = new Date(deal.endDate);
          return startDate <= now && endDate >= now;
        });
        setDeals(activeDeals);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset countdown to 12 hours when it reaches zero
          hours = 12;
          minutes = 0;
          seconds = 0;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Convert numbers to Bengali numerals
  const toBengaliNum = (num: number): string => {
    const bengaliNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bengaliNums[parseInt(d)]).join('');
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

  // Use ticker messages from settings or fallback to default
  const offerMessages = settings?.tickerMessages?.length > 0 
    ? settings.tickerMessages 
    : [
        "প্রথম অর্ডারে ১০% ডিসকাউন্ট! কোড: NEXTGEN10",
        "সারা বাংলাদেশে ফ্রি ডেলিভারি (মিনিমাম ১৫০০/- অর্ডার)",
        "৫০% পর্যন্ত ছাড় সীমিত সময়ের জন্য",
        "১০০% খাঁটি পণ্যের নিশ্চয়তা বা টাকা ফেরত",
        "refer your friends and get rewards"
      ];

  const brandNames = [
    "FarmingBD", "NextGen", "Organic Life", "Pure Nature", "Health First", "Eco Farm", "Green Harvest"
  ];

  return (
    <main className="min-h-screen bg-brand-bg">
      <SEOMetadata seoData={seoData} />
      <Header />
      
      {/* Latest Offer Ticker */}
      <div className="bg-brand-green-dark text-white overflow-hidden py-2 border-b border-white/10 select-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {[...offerMessages, ...offerMessages].map((msg, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-black italic tracking-wider">
              <Zap size={14} className="text-emerald-400" />
              <span>{msg}</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
          ))}
        </motion.div>
      </div>

      <Hero />

      <BannerCarousel />

      {/* Product Ticker */}
      <div className="bg-white py-4 border-b border-emerald-50 overflow-hidden select-none">
        {products.length > 0 ? (
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-8 items-center"
          >
            {[...products, ...products].map((product: any, i: number) => (
              <Link key={i} href={`/shop/${product._id}`} className="flex items-center gap-3 px-6 py-2 bg-[#f9faf5] rounded-full border border-emerald-100/50 cursor-pointer hover:border-brand-green transition-colors">
                <ShoppingBag size={14} className="text-brand-green" />
                <span className="text-xs font-bold text-slate-700">{product.name}</span>
                <span className="text-brand-green font-black text-xs">৳{product.price}</span>
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
          </div>
        )}
      </div>
      
      <CategoryBar />

      {/* Flash Sale Section */}
      <section className="py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-[#fffbeb] rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-amber-600 shadow-sm shadow-amber-200/50">
                  <Flame size={28} className="md:w-8 md:h-8 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-amber-900 italic">Flash Sale!</h2>
                  <p className="text-amber-800/60 text-[10px] md:text-sm font-bold">সীমিত সময়ের অফার - দ্রুত লুফে নিন!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <span className="text-slate-400 text-xs font-black uppercase tracking-widest hidden md:block">অফার শেষ হতে বাকি:</span>
                 <div className="flex gap-2">
                    {[
                      { l: 'Hrs', v: toBengaliNum(countdown.hours) },
                      { l: 'Min', v: toBengaliNum(countdown.minutes) },
                      { l: 'Sec', v: toBengaliNum(countdown.seconds) }
                    ].map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="bg-brand-red text-white w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-black shadow-lg shadow-brand-red/20">
                          {t.v}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 mt-1 uppercase">{t.l}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.length > 0 ? (
                products.slice(0, 4).map((product: any) => (
                  <div key={product._id} className="relative group">
                    <ProductCard product={product} />
                    <div className="absolute top-4 right-4 bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce">
                      HOT
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-[#f9faf5] border-y border-emerald-50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-green-dark">ডেলিভারি সুবিধা</h4>
              <p className="text-slate-500 text-[10px] md:text-xs italic">সারাদেশে হোম ডেলিভারি</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-green-dark">১০০% ক্যাশ ব্যাক</h4>
              <p className="text-slate-500 text-[10px] md:text-xs italic">পণ্যে ভেজাল পেলে টাকা ফেরত</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-green-dark">রিটার্ন পলিসি</h4>
              <p className="text-slate-500 text-[10px] md:text-xs italic">৭ দিনের মধ্যে সহজ রিটার্ন</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-green-dark">২৪/৭ সাপোর্ট</h4>
              <p className="text-slate-500 text-[10px] md:text-xs italic">সরাসরি আমাদের সাথে কথা বলুন</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products with Sidebar Widget */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Banner */}
          <Link href={featuredBanner?.link || '/shop'} className="block w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-brand-green-dark mb-16 relative overflow-hidden group">
            {featuredBanner ? (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={featuredBanner.image}
                    alt={featuredBanner.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pattern/1920/1080')] opacity-10 mix-blend-overlay" />
              </>
            )}
            <div className="absolute right-0 bottom-0 w-32 md:w-64 h-32 md:h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-1000" />
          </Link>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left Content (Products) */}
            <div className="lg:col-span-9 space-y-16">
              {categories.length > 0 ? (
                /* Top 4 Categories Sections */
                categories.slice(0, 4).map((cat: any) => (
                  <div key={cat._id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex justify-between items-end border-b border-emerald-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-green shadow-sm shadow-emerald-100 border border-emerald-50">
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-brand-green-dark italic">{cat.name}</h3>
                          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{cat.name_en}</p>
                        </div>
                      </div>
                      <Link href={`/shop?category=${encodeURIComponent(cat.name_en)}`} className="text-brand-green font-black text-xs italic hover:underline flex items-center gap-1 group">
                        সব দেখুন
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> 
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                      {products
                        .filter((p: any) => p.category === cat.name_en)
                        .slice(0, 3)
                        .map((product: any) => (
                          <ProductCard key={product._id} product={product} />
                        ))
                      }
                      {products.filter((p: any) => p.category === cat.name_en).length === 0 && (
                        <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-slate-400 italic text-sm">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                </div>
              )}
            </div>

            {/* Right Sidebar Widget */}
            <aside className="lg:col-span-3 space-y-8">
              {/* Deal/Coupon Widget */}
              {deals.length > 0 && (
                <div className="bg-gradient-to-br from-brand-green to-emerald-600 text-white p-8 rounded-none shadow-xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-none flex items-center justify-center text-white">
                        <Tag size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black italic">বিশেষ অফার</h4>
                        <p className="text-emerald-50/70 text-xs mt-1 italic font-bold">কুপন কোড ব্যবহার করে ডিসকাউন্ট পান</p>
                      </div>
                    </div>
                    
                    {deals.slice(0, 1).map((deal) => (
                      <div key={deal._id} className="space-y-4">
                        <div className="bg-white/10 rounded-xl p-4 space-y-2">
                          <p className="text-sm font-bold italic">{deal.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black">
                              {deal.discountType === 'percentage' ? `${deal.discountValue}%` : `৳${deal.discountValue}`}
                            </span>
                            <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">
                              ছাড়
                            </span>
                          </div>
                        </div>
                        
                        {deal.code && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 flex items-center justify-between">
                              <span className="font-black text-sm">{deal.code}</span>
                              <button
                                onClick={() => handleCopyCoupon(deal.code!)}
                                className="text-white hover:text-emerald-200 transition-colors"
                              >
                                {copiedCoupon === deal.code ? <Check size={18} /> : <Copy size={18} />}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleUseCoupon(deal.code!)}
                          className="w-full bg-white text-brand-green-dark py-3 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all"
                        >
                          ব্যবহার করুন
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              )}

              {/* Newsletter Widget */}
              <div className="bg-white p-8 rounded-none shadow-xl border border-emerald-50 relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-emerald-50 rounded-none flex items-center justify-center text-brand-green">
                    <Send size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-brand-green-dark italic">Newsletter</h4>
                    <p className="text-slate-500 text-xs mt-1 italic font-bold">নতুন অফার পেতে সাবস্ক্রাইব করুন</p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="আপনার ইমেইল" 
                      className="w-full bg-[#f9fafb] border-none rounded-none py-3 px-5 text-xs focus:ring-2 focus:ring-brand-green outline-none"
                    />
                    <button className="w-full bg-brand-green text-white py-3 rounded-none font-black text-sm shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
                      জয়েন করুন
                    </button>
                  </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* Quick Contact Widget */}
              <div className="bg-brand-green text-white p-8 rounded-none shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-white/10 rounded-none flex items-center justify-center text-white">
                    <PhoneCall size={24} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic">সরাসরি অর্ডার</h4>
                    <p className="text-emerald-50/70 text-xs mt-1 italic">সরাসরি কল করেও অর্ডার করতে পারেন</p>
                  </div>
                  <p className="text-2xl font-black tracking-tighter italic">+৮৮০ ১৬১১-১৩৩৩৬৫</p>
                  <button className="w-full bg-white text-brand-green-dark py-3 rounded-none font-black text-sm hover:bg-emerald-50 transition-all">
                    কল দিন
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* Category Shortcuts */}
              <div className="bg-[#f0ede4] p-8 rounded-none space-y-6">
                <h4 className="text-lg font-black text-slate-700 italic border-b border-slate-200 pb-2">জনপ্রিয় ক্যাটাগরি</h4>
                <div className="space-y-3">
                  {['মধু', 'ঘি', 'তেল', 'খেজুর'].map((item, i) => (
                    <Link key={i} href={`/shop?search=${encodeURIComponent(item)}`} className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-slate-600 group-hover:text-brand-green transition-colors">{item}</span>
                      <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#fdfcf0] border-y border-emerald-50 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 pointer-events-none">
           <Quote size={400} />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-brand-green-dark italic">সন্তুষ্ট গ্রাহকদের কথা</h2>
            <p className="text-slate-500 italic max-w-2xl mx-auto">
              আমাদের পণ্যের গুণগত মান সম্পর্কে আমাদের গ্রাহকরা যা বলছেন। আপনার সন্তুষ্টিই আমাদের সার্থকতা।
            </p>
          </div>

          <div className="overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-6"
            >
              {reviews.length > 0 ? (
                // Show first 3 reviews, then duplicate for infinite loop
                [...reviews.slice(0, 3), ...reviews.slice(0, 3)].map((review: any, i: number) => (
                  <div key={`${review._id}-${i}`} className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-emerald-50 hover:shadow-xl transition-all relative group h-full">
                      <div className="absolute top-0 right-10 -translate-y-1/2 bg-brand-green w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= review.rating ? 'text-amber-400' : 'text-slate-200'}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <p className="text-slate-600 italic leading-relaxed font-medium">&quot;{review.comment}&quot;</p>
                        <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-brand-green font-black">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black text-brand-green-dark">{review.userName}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {new Date(review.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback to hardcoded testimonials if no reviews
                [...[
                  { name: 'আরিফুল ইসলাম', text: 'নেক্সটজেন FarmingBD-এর ঘি সত্যি চমৎকার! দানাদার এবং অসাধারণ ঘ্রাণ। প্যাকেজিং টাও অনেক প্রিমিয়াম ছিল।', role: 'নিয়মিত গ্রাহক' },
                  { name: 'সাদিয়া সুলতানা', text: 'সুন্দরবনের খলিসা মধু এর আগে অনেক জায়গা থেকে নিয়েছি কিন্তু এখানকারটা একদম খাঁটি মনে হলো। ধন্যবাদ!', role: 'গৃহিণী' },
                  { name: 'মাহমুদ হাসান', text: 'অর্ডার করার পরের দিনই ডেলিভারি পেয়েছি। পণ্যের মান নিয়ে কোনো কমপ্লেন নেই। সার্ভিস খুব ফাস্ট।', role: 'চাকুরীজীবী' }
                ], ...[
                  { name: 'আরিফুল ইসলাম', text: 'নেক্সটজেন FarmingBD-এর ঘি সত্যি চমৎকার! দানাদার এবং অসাধারণ ঘ্রাণ। প্যাকেজিং টাও অনেক প্রিমিয়াম ছিল।', role: 'নিয়মিত গ্রাহক' },
                  { name: 'সাদিয়া সুলতানা', text: 'সুন্দরবনের খলিসা মধু এর আগে অনেক জায়গা থেকে নিয়েছি কিন্তু এখানকারটা একদম খাঁটি মনে হলো। ধন্যবাদ!', role: 'গৃহিণী' },
                  { name: 'মাহমুদ হাসান', text: 'অর্ডার করার পরের দিনই ডেলিভারি পেয়েছি। পণ্যের মান নিয়ে কোনো কমপ্লেন নেই। সার্ভিস খুব ফাস্ট।', role: 'চাকুরীজীবী' }
                ]].map((test, i: number) => (
                  <div key={`fallback-${i}`} className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)]">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-emerald-50 hover:shadow-xl transition-all relative group h-full">
                      <div className="absolute top-0 right-10 -translate-y-1/2 bg-brand-green w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                        <Star size={20} fill="currentColor" />
                      </div>
                      <div className="space-y-6">
                        <p className="text-slate-600 italic leading-relaxed font-medium">&quot;{test.text}&quot;</p>
                        <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-brand-green font-black">
                            {test.name[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-brand-green-dark">{test.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{test.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20 px-8 bg-brand-bg">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-brand-green-dark to-brand-green-deep rounded-[4rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          <div className="relative z-10 p-8 md:p-20 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-block bg-white/10 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">খাঁটি ও নিরাপদ</div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight italic">
                অর্গানিক ফুড নিয়ে <br />
                চিন্তিত?
              </h2>
              <p className="text-emerald-50 md:text-xl italic opacity-80 leading-relaxed max-w-lg">
                আমরা সরাসরি কৃষকের মাঠ থেকে ফসল সংগ্রহ করে আপনার দোরগোড়ায় পৌঁছে দিই। কোনো মধ্যস্বত্বভোগী নেই, কোনো ভেজাল নেই।
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/shop" className="bg-white text-emerald-900 px-10 py-5 rounded-full font-black text-lg shadow-xl hover:bg-emerald-50 transition-all border-b-4 border-emerald-200 active:border-b-0 active:translate-y-1 inline-block">
                  পণ্য দেখুন
                </Link>
                <Link href="/about" className="border-2 border-white/30 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm inline-block">
                  আমাদের গল্প
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end pr-8 relative h-[450px]">
              <div className="absolute -inset-10 bg-white/10 rounded-full blur-[100px]" />
              <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-1000">
                {settings && settings.bannerImage ? (
                  <img 
                    src={settings.bannerImage} 
                    alt="Banner" 
                    className="w-full h-full rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 object-cover border-8 border-white/10"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      console.error('Failed URL:', settings.bannerImage);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white/50 text-sm">No banner image set</p>
                    <Image 
                      src="https://picsum.photos/seed/harvest/800/600" 
                      alt="Banner" 
                      fill
                      className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 object-cover border-8 border-white/10 absolute inset-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer Brand Ticker */}
      <div className="bg-brand-bg text-brand-green py-12 overflow-hidden border-y border-emerald-50 select-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-24 items-center"
        >
          {[...brandNames, ...brandNames].map((name, i) => (
            <div key={i} className="text-4xl md:text-6xl font-black italic opacity-10 hover:opacity-100 transition-opacity cursor-default tracking-tighter">
              {name}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
