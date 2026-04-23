'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, ArrowRight, Grid } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat: any) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold italic">Loading categories...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      
      {/* Header Section */}
      <div className="bg-brand-green-dark py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
           <Grid size={400} className="absolute -top-20 -right-20 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
           <h1 className="text-4xl md:text-6xl font-black text-white italic mb-6 tracking-tight">সকল ক্যাটাগরি</h1>
           <p className="text-emerald-50/70 max-w-2xl mx-auto italic font-medium leading-relaxed">
             আমাদের সকল ক্যাটাগরি থেকে আপনার পছন্দের পণ্য খুঁজে নিন। প্রতিটি ক্যাটাগরিতে রয়েছে সেরা মানের অর্গানিক পণ্য।
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="ক্যাটাগরি খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-emerald-50 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-brand-green outline-none shadow-sm transition-all"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${encodeURIComponent(cat.name_en)}`}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50 hover:border-brand-green/30 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:bg-brand-green group-hover:scale-110 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black text-brand-green-dark mb-2 group-hover:text-brand-green transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-400 font-medium italic mb-4">
                  {cat.name_en}
                </p>
                
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {cat.subcategories.slice(0, 3).map((sub: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-emerald-50 text-slate-600 rounded-full font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                    {cat.subcategories.length > 3 && (
                      <span className="px-3 py-1 text-xs bg-emerald-50 text-slate-400 rounded-full font-medium">
                        +{cat.subcategories.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center text-brand-green font-black text-sm group-hover:translate-x-2 transition-transform">
                  <span>পণ্য দেখুন</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
              
              {/* Decorative background */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-brand-green/10 group-hover:scale-150 transition-all duration-500" />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100/50">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-black text-brand-green-dark italic mb-2">কোনো ক্যাটাগরি পাওয়া যায়নি</h3>
            <p className="text-slate-400 text-sm font-medium italic mb-6">
              অন্য কোনো নামে চেষ্টা করুন
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-brand-green text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all"
            >
              সার্চ রিসেট করুন
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
