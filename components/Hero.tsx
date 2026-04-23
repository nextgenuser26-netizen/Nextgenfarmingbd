'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Sparkles, ShieldCheck, Leaf, ShoppingBag, Plus, Tag, Loader2, Copy, Check } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: string;
  order: number;
  isActive: boolean;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselBanners, setCarouselBanners] = useState<Banner[]>([]);
  const [rightTopBanner, setRightTopBanner] = useState<Banner | null>(null);
  const [rightBottomBanner, setRightBottomBanner] = useState<Banner | null>(null);
  const [latestDeal, setLatestDeal] = useState<any>(null);
  const [latestProduct, setLatestProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchLatestDeal();
    fetchLatestProduct();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners?isActive=true');
      const data = await res.json();
      const banners = data.banners || [];

      // Filter banners by position
      const carousel = banners
        .filter((b: Banner) => b.position === 'hero-carousel')
        .sort((a: Banner, b: Banner) => a.order - b.order);

      const rightTop = banners
        .filter((b: Banner) => b.position === 'hero-right-top')
        .sort((a: Banner, b: Banner) => a.order - b.order)[0] || null;

      const rightBottom = banners
        .filter((b: Banner) => b.position === 'hero-right-bottom')
        .sort((a: Banner, b: Banner) => a.order - b.order)[0] || null;

      setCarouselBanners(carousel);
      setRightTopBanner(rightTop);
      setRightBottomBanner(rightBottom);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestDeal = async () => {
    try {
      const res = await fetch('/api/deals?limit=1');
      const data = await res.json();
      const deals = data.deals || [];
      const activeDeals = deals.filter((deal: any) => {
        const now = new Date();
        const startDate = new Date(deal.startDate);
        const endDate = new Date(deal.endDate);
        return startDate <= now && endDate >= now;
      });
      if (activeDeals.length > 0) {
        setLatestDeal(activeDeals[0]);
      }
    } catch (error) {
      console.error('Error fetching latest deal:', error);
    }
  };

  const fetchLatestProduct = async () => {
    try {
      const res = await fetch('/api/products?limit=1');
      const data = await res.json();
      const products = data.products || [];
      if (products.length > 0) {
        setLatestProduct(products[0]);
      }
    } catch (error) {
      console.error('Error fetching latest product:', error);
    }
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

  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselBanners.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [carouselBanners.length]);

  const slides = carouselBanners.length > 0 ? carouselBanners.map((b, i) => ({
    id: b._id,
    title: b.title,
    highlight: b.title_en || '',
    description: b.description || '',
    image: isMobile && b.mobileImage ? b.mobileImage : b.image,
    bgColor: 'from-emerald-900 to-emerald-700',
    badge: 'বিশেষ অফার',
    icon: <ShieldCheck className="text-emerald-300" size={24} />,
    link: b.link
  })) : [];

  return (
    <section className="bg-brand-bg py-4 md:py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Animated Carousel Banner */}
        <div className="md:col-span-8 bg-slate-100 overflow-hidden relative shadow-lg min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] group">
          {slides.length > 0 ? (
            <>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{
                    x: { type: "spring", stiffness: 100, damping: 20 },
                    duration: 0.5
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgColor} flex items-center`}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={slides[currentSlide].image}
                      alt="Banner"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mb-20" />
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <p className="text-slate-400 text-sm italic">Loading...</p>
            </div>
          )}
        </div>
        
        {/* Right Side: Promo Banners */}
        <div className="md:col-span-4 flex flex-col gap-6 h-full min-h-[350px] md:min-h-0">
          {/* Top Banner - Latest Deal */}
          <div className="flex-1 bg-gradient-to-br from-brand-green to-emerald-600 rounded-[2rem] p-6 relative overflow-hidden group border border-emerald-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center">
            {latestDeal ? (
              <>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-white/30 w-fit">
                     <Tag size={12} /> বিশেষ অফার
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    {latestDeal.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white">
                      {latestDeal.discountType === 'percentage' ? `${latestDeal.discountValue}%` : `৳${latestDeal.discountValue}`}
                    </span>
                    <span className="text-white/80 text-sm font-black">ছাড়</span>
                  </div>
                  {latestDeal.code && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
                        <span className="font-black text-sm text-white">{latestDeal.code}</span>
                        <button
                          onClick={() => handleCopyCoupon(latestDeal.code!)}
                          className="text-white hover:text-emerald-200 transition-colors"
                        >
                          {copiedCoupon === latestDeal.code ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => handleUseCoupon(latestDeal.code!)}
                    className="w-full bg-white text-brand-green-dark py-2.5 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all"
                  >
                    ব্যবহার করুন
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-white/20 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-white/30 w-fit">
                     <Tag size={12} /> বিশেষ অফার
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    বর্তমানে কোনো অফার নেই
                  </h3>
                  <Link href="/deals" className="text-white/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-white/10 px-4 py-2 rounded-xl">
                    সব অফার দেখুন <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
          </div>

          {/* Bottom Banner - Latest Product */}
          <Link href={latestProduct ? `/shop/${latestProduct._id}` : '/shop'} className="flex-1 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] rounded-[2rem] p-6 relative overflow-hidden group border border-green-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-center">
            {latestProduct ? (
              <>
                <div className="absolute inset-0 opacity-20">
                  {latestProduct.images && latestProduct.images.length > 0 ? (
                    <Image
                      src={latestProduct.images[0]}
                      alt={latestProduct.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      src="https://picsum.photos/seed/product/400/400"
                      alt="Product"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-brand-green text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-emerald-500 w-fit">
                     <Leaf size={12} /> নতুন পণ্য
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-emerald-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    {latestProduct.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-brand-green">
                      ৳{latestProduct.price}
                    </span>
                    {latestProduct.oldPrice && (
                      <span className="text-emerald-800/60 text-sm line-through">৳{latestProduct.oldPrice}</span>
                    )}
                  </div>
                  <div className="text-emerald-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-brand-green/10 px-4 py-2 rounded-xl">
                    এখনই কিনুন <ArrowRight size={16} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative z-10 space-y-3 md:space-y-4">
                  <span className="bg-brand-green text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-lg border border-emerald-500 w-fit">
                     <Leaf size={12} /> নতুন পণ্য
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-emerald-950 italic leading-tight group-hover:scale-105 transition-transform origin-left">
                    বর্তমানে কোনো পণ্য নেই
                  </h3>
                  <div className="text-emerald-800/80 text-xs md:text-sm font-black italic flex items-center gap-2 group-hover:translate-x-2 transition-transform w-fit bg-brand-green/10 px-4 py-2 rounded-xl">
                    শপিং করুন <ArrowRight size={16} />
                  </div>
                </div>
              </>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 blur-3xl rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
