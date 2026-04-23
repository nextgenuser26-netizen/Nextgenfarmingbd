'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-black text-brand-green-dark flex items-center gap-3">
            <span className="w-2 h-7 bg-brand-green rounded-full shadow-sm shadow-brand-green/20" />
            জনপ্রিয় ক্যাটাগরি
          </h2>
          <Link href="/categories" className="text-sm text-brand-green font-bold cursor-pointer hover:underline">সবগুলো দেখুন →</Link>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible">
          {categories.slice(0, 10).map((cat: any) => (
            <Link
              key={cat._id}
              href={`/shop?category=${encodeURIComponent(cat.name_en)}`}
              className="flex-shrink-0 group flex flex-col items-center gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-md transition-all text-center border border-transparent hover:border-emerald-50"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-brand-green tracking-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
