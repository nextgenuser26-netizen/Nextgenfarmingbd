'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, LayoutGrid, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [allPagesBanner, setAllPagesBanner] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const sortOptions = [
    { id: 'default', name: 'ডিফল্ট' },
    { id: 'price-low', name: 'মূল্য: কম থেকে বেশি' },
    { id: 'price-high', name: 'মূল্য: বেশি থেকে কম' },
    { id: 'rating', name: 'জনপ্রিয়তা (রেটিং)' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p: any) => p.category === selectedCategory);
    }

    // Subcategory Filter
    if (selectedSubcategory) {
      result = result.filter((p: any) => p.subcategory === selectedSubcategory);
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter((p: any) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price Filter
    result = result.filter((p: any) => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedSubcategory, sortBy, maxPrice, searchQuery, products]);

  return (
    <main className="min-h-screen bg-brand-bg pb-20">
      <Header />
      
      {/* Premium Shop Header */}
      {allPagesBanner ? (
        <Link href={allPagesBanner.link || '/shop'} className="block w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-slate-100 mb-8 relative overflow-hidden">
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
        <div className="bg-brand-green-dark py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
             <LayoutGrid size={400} className="absolute -top-20 -right-20 rotate-12" />
          </div>
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-[0.3em] mb-6"
             >
               Our Collection
             </motion.div>
             <h1 className="text-4xl md:text-6xl font-black text-white italic mb-6 tracking-tight">সব পণ্য এক জায়গায়</h1>
             <p className="text-emerald-50/70 max-w-2xl mx-auto italic font-medium leading-relaxed">
               নেক্সটজেন FarmingBD-এ আপনার প্রয়োজনীয় সকল অর্গানিক এবং প্রিমিয়াম পণ্য সেরা দামে সংগ্রহ করুন।
               আমরা সরাসরি কৃষকের মাঠ থেকে আপনার কাছে পণ্য পৌঁছে দিই।
             </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Enhanced Filter Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              
              {/* Search Box */}
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="পণ্য খুঁজুন..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-emerald-50 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-brand-green outline-none shadow-sm transition-all group-hover:border-emerald-200"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-brand-green transition-colors" />
              </div>

              {/* Price Filter Bar */}
              <div>
                <h3 className="text-lg font-black text-brand-green-dark mb-6 flex items-center gap-2 italic">
                  <SlidersHorizontal size={18} />
                  মূল্য সীমা (৳)
                </h3>
                <div className="px-2 space-y-6">
                  <input 
                    type="range" 
                    min="100" 
                    max="6000" 
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-emerald-50 rounded-lg appearance-none cursor-pointer accent-brand-green"
                  />
                  <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-50 shadow-sm font-black text-brand-green-dark text-sm">
                    <span className="opacity-40">সর্বোচ্চ:</span>
                    <span className="text-lg">৳{maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-black text-brand-green-dark mb-6 flex items-center gap-2 italic">
                  <Filter size={18} />
                  ক্যাটাগরি
                </h3>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-emerald-300">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group ${selectedCategory === 'All' ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20 scale-[1.02]' : 'bg-white text-slate-500 hover:bg-emerald-50 border border-emerald-50 hover:border-emerald-100 hover:text-brand-green-dark'}`}
                  >
                    <span>সকল পণ্য</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === 'All' ? 'bg-white/20' : 'bg-emerald-50 group-hover:bg-brand-green group-hover:text-white'}`}>{products.length}</span>
                  </button>
                  
                  {categories.length > 0 ? categories.map((cat: any) => (
                    <div key={cat._id} className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.name_en);
                          setSelectedSubcategory('');
                        }}
                        className={`w-full text-left px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group ${selectedCategory === cat.name_en && !selectedSubcategory ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20 scale-[1.02]' : 'bg-white text-slate-500 hover:bg-emerald-50 border border-emerald-50 hover:border-emerald-100 hover:text-brand-green-dark'}`}
                      >
                         <div className="flex items-center gap-3">
                           <span>{cat.icon}</span>
                           <span>{cat.name}</span>
                         </div>
                         <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === cat.name_en ? 'bg-white/20' : 'bg-emerald-50 group-hover:bg-brand-green group-hover:text-white'}`}>
                           {products.filter((p: any) => p.category === cat.name_en).length}
                         </span>
                      </button>
                      
                      {/* Interactive Subcategories */}
                      <AnimatePresence>
                        {selectedCategory === cat.name_en && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-8 pr-2 space-y-1"
                          >
                            {cat.subcategories?.map((sub: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors flex items-center justify-between group ${selectedSubcategory === sub ? 'text-brand-green' : 'text-slate-400 hover:text-brand-green'}`}
                              >
                                <span className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full group-hover:scale-125 transition-all ${selectedSubcategory === sub ? 'bg-brand-green' : 'bg-slate-200 group-hover:bg-brand-green'}`} />
                                  {sub}
                                </span>
                                {selectedSubcategory === sub && (
                                  <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">
                                    {products.filter((p: any) => p.subcategory === sub).length}
                                  </span>
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )) : (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Widget Help */}
              <div className="bg-[#fdfcf0] p-8 rounded-[3rem] border border-emerald-100/50 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-black text-brand-green-dark mb-2 italic">প্রয়োজনীয় সাহায্য?</h4>
                  <p className="text-slate-500 text-[10px] mb-5 font-bold italic leading-relaxed">সরাসরি আমাদের প্রতিনিধির সাথে কথা বলতে কল করুন যেকোনো সময়।</p>
                  <a href="tel:+8801900000000" className="flex items-center justify-center gap-2 bg-brand-green text-white py-3 rounded-2xl font-black text-xs hover:bg-brand-green-dark transition-all shadow-lg shadow-brand-green/10">
                    <PhoneCall size={14} />
                    কল দিন
                  </a>
                </div>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-green/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-10">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-[2rem] border border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pl-0 md:pl-4 font-bold text-slate-400 text-sm italic">
                <div className="flex items-center gap-2">
                  <span>Show:</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-brand-green rounded-xl"><LayoutGrid size={16} /></button>
                    <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-brand-green rounded-xl"><List size={16} /></button>
                  </div>
                </div>
                <div className="hidden sm:block w-[1px] h-4 bg-slate-100 mx-2" />
                <p>
                  পণ্য পাওয়া গেছে: <span className="text-brand-green-dark font-black tracking-tighter italic ml-1">{filteredAndSortedProducts.length}টি</span>
                </p>
              </div>

              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-3 bg-[#f9fafb] px-6 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-emerald-50 transition-all min-w-[200px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-brand-green" />
                    <span>Sort by: {sortOptions.find(o => o.id === sortBy)?.name}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-emerald-50 py-2 z-20 overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors hover:bg-emerald-50 ${sortBy === option.id ? 'text-brand-green bg-emerald-50/50' : 'text-slate-600'}`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Display Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {products.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProducts.map((product) => (
                    <motion.div
                      layout
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100/50 space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                  <Search size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-brand-green-dark italic">দুঃখিত, কোনো পণ্য পাওয়া যায়নি</h3>
                  <p className="text-slate-400 text-sm font-medium italic">আপনার ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSubcategory('');
                    setMaxPrice(6000);
                    setSearchQuery('');
                  }}
                  className="bg-brand-green text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContentWrapper />
    </Suspense>
  );
}

function ShopContentWrapper() {
  const searchParams = useSearchParams();
  // Using the searchParams string as a key will force ShopContent to re-mount
  // and re-initialize its useState whenever the URL query params change.
  return <ShopContent key={searchParams.toString()} />;
}

// Dummy Icon for the widget
function PhoneCall({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
