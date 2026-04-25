'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Phone, X, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '@/lib/data';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';

export default function Header() {
  const { totalItems, setIsDrawerOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults((data.products || []).slice(0, 6));
        } catch (error) {
          console.error('Error searching products:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-brand-green text-white py-1.5 px-4 md:px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা</span>
          </div>
          <div className="flex items-center gap-4">
            <span>হেল্পলাইন: +৮৮০ ১৬১১-১৩৩৩৬৫</span>
            <Link href="/track-order" className="hover:underline">ট্র্যাক অর্ডার</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-8">
        {/* Mobile/Tablet Menu Toggle */}
        <button 
          className="xl:hidden p-1 text-emerald-800 flex-shrink-0"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <div className="flex items-center gap-2">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings.siteName || 'Logo'}
                className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-[22px]"
              />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-green rounded-full flex items-center justify-center text-white">
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white rounded-sm transform rotate-45 group-hover:rotate-0 transition-transform duration-300"></div>
              </div>
            )}
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-brand-green-dark tracking-tight italic whitespace-nowrap">
              {settings?.siteName ? (
                settings.siteName.split(/(Gen)/g).map((part: string, i: number) => 
                  part === 'Gen' ? (
                    <span key={i} style={{ color: '#CDB290' }}>Gen</span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )
              ) : (
                <>
                  নেক্সট<span style={{ color: '#CDB290' }}>জেন</span> FarmingBD
                </>
              )}
            </span>
          </div>
        </Link>

        {/* Navigation - Hidden on tablet/laptop, shown on large desktop */}
        <nav className="hidden xl:flex items-center gap-6 whitespace-nowrap">
          <Link href="/" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">Home</Link>
          <Link href="/shop" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">Shop</Link>
          <Link href="/about" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">About</Link>
          <Link href="/blogs" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">Blogs</Link>
          <Link href="/deals" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">Deals</Link>
          <Link href="/contact" className="text-sm font-bold text-slate-700 hover:text-brand-green transition-colors">Contact Us</Link>
        </nav>

        {/* Search Bar - Shown on tablet and above */}
        <div className="hidden md:flex items-center flex-1 max-w-[200px] lg:max-w-[300px] xl:max-w-md px-2 lg:px-4 relative" ref={searchRef}>
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="পণ্য খুঁজুন..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-[#f3f4f6] border-none rounded-full py-2 md:py-2.5 px-4 md:px-6 text-xs md:text-sm focus:ring-2 focus:ring-brand-green-light outline-none transition-shadow"
            />
            <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-brand-green font-bold italic text-[10px] md:text-sm cursor-pointer hover:text-brand-green-dark">খুঁজুন</div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
              >
                <div className="p-2 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-widest">অনুসন্ধানের ফল</span>
                  <button onClick={() => setIsSearchFocused(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={12} /></button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link 
                      key={product._id} 
                      href={`/shop/${product._id}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-emerald-50 transition-colors group border-b border-slate-50 last:border-none"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                        <Image 
                          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} 
                          alt={product.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 italic truncate group-hover:text-brand-green transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-green font-black text-xs italic">
                            ৳{product.hasVariants && product.variants && product.variants.length > 0 
                              ? Math.min(...product.variants.map((v: any) => v.price))
                              : product.price}
                          </span>
                          {product.oldPrice && <span className="text-[10px] text-slate-300 line-through">৳{product.oldPrice}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  href={`/shop?search=${searchQuery}`}
                  onClick={() => setIsSearchFocused(false)}
                  className="block w-full p-3 text-center bg-brand-green text-white font-black text-xs italic hover:bg-brand-green-dark transition-colors"
                >
                  সবগুলো দেখুন
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center text-emerald-800 hover:text-brand-green transition-colors relative group"
          >
            <div className="w-6 h-6 border-2 border-current rounded-md flex items-center justify-center">
              <ShoppingCart size={14} />
            </div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="hidden lg:block text-[10px] mt-1 font-bold">ব্যাগ</span>
          </button>
          
          <Link href="/customer-login?mode=register" className="hidden sm:inline-block bg-emerald-50 text-emerald-700 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-emerald-100 transition-colors shadow-sm whitespace-nowrap border border-emerald-200">
            নিবন্ধন
          </Link>
          <Link href="/customer-login" className="hidden sm:inline-block bg-brand-green-dark text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-brand-green-deep transition-colors shadow-sm whitespace-nowrap">
            লগইন
          </Link>
          <Link href="/customer-login" className="sm:hidden text-emerald-800">
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile Search - Visible on mobile only */}
      <div className="md:hidden px-4 pb-4 relative" ref={mobileSearchRef}>
        <div className="relative">
          <input 
            type="text" 
            placeholder="পণ্য সার্চ করুন..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-gray-100 border-none rounded-lg py-2 px-10 text-sm focus:ring-2 focus:ring-brand-green outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        {/* Mobile Search Results */}
        <AnimatePresence>
          {isSearchFocused && searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
            >
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.map((product) => (
                  <Link 
                    key={product._id} 
                    href={`/shop/${product._id}`}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-emerald-50 border-b border-slate-50 last:border-none"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <Image 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 italic truncate">{product.name}</h4>
                      <p className="text-brand-green font-black text-[10px] italic">
                        ৳{product.hasVariants && product.variants && product.variants.length > 0 
                          ? Math.min(...product.variants.map((v: any) => v.price))
                          : product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-[70] flex flex-col"
            >
              <div className="p-4 border-bottom flex justify-between items-center bg-brand-green text-white">
                <span className="font-bold">মেনু</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>
              <div className="overflow-y-auto flex-1 py-4">
                <div className="px-4 mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">নেভিগেশন</h3>
                  <div className="space-y-1">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">Home</Link>
                    <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">Shop</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">About</Link>
                    <Link href="/blogs" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">Blogs</Link>
                    <Link href="/deals" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">Deals</Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">Contact Us</Link>
                  </div>
                </div>
                <div className="px-4 mb-4 border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">ক্যাটাগরি</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id} 
                        href={`/shop?category=${encodeURIComponent(cat.name_en)}`}
                        className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg text-sm font-medium group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <ChevronDown size={14} className="-rotate-90 text-gray-300 group-hover:text-brand-green" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">অন্যান্য</h3>
                  <div className="space-y-1">
                    <Link href="/offers" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">অফার সমূহ</Link>
                    <Link href="/track-order" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">অর্ডার ট্র্যাক</Link>
                  </div>
                </div>
                <div className="border-t border-gray-100 p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">অ্যাকাউন্ট</h3>
                  <div className="space-y-1">
                    <Link href="/customer-login" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg">লগইন</Link>
                    <Link href="/customer-login?mode=register" onClick={() => setIsMenuOpen(false)} className="block p-3 font-medium hover:bg-gray-100 rounded-lg text-emerald-700">নিবন্ধন</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
