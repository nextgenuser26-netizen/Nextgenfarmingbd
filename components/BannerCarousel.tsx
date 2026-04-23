'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners?isActive=true&position=home');
      const data = await res.json();
      const sortedBanners = (data.banners || [])
        .filter((banner: Banner) => {
          const now = new Date();
          const startDate = banner.startDate ? new Date(banner.startDate) : null;
          const endDate = banner.endDate ? new Date(banner.endDate) : null;
          return (!startDate || now >= startDate) && (!endDate || now <= endDate);
        })
        .sort((a: Banner, b: Banner) => a.order - b.order);
      setBanners(sortedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="relative h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const currentImage = isMobile && currentBanner.mobileImage ? currentBanner.mobileImage : currentBanner.image;

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      <div className="relative h-full">
        {currentBanner.link ? (
          <Link href={currentBanner.link} className="block h-full">
            <Image
              src={currentImage}
              alt={currentBanner.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </Link>
        ) : (
          <Image
            src={currentImage}
            alt={currentBanner.title}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-brand-green-dark" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-brand-green-dark" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
