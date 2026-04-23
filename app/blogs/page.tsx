'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Search, Tag, ChevronRight, Mail, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  title_en?: string;
  slug: string;
  excerpt?: string;
  excerpt_en?: string;
  featuredImage?: string;
  author: string;
  tags?: string[];
  category?: string;
  status: string;
  publishedAt?: Date;
  createdAt: Date;
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?status=published');
      const data = await res.json();
      setBlogPosts(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentPosts = blogPosts.slice(0, 3);
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  // Extract unique categories from blogs
  const categories = Array.from(new Set(blogPosts.map(post => post.category).filter(Boolean)));
  
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-[#fcfdfa] pb-0">
      <Header />
      
      {/* Featured Header */}
      <section className="bg-brand-green-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/leaves/1920/1080')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-300 uppercase tracking-widest border border-white/5"
           >
             NextGen Blog Portal
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-black text-white italic leading-tight"
           >
             সুস্থ জীবন ও <span className="text-emerald-300">বিশুদ্ধতার বার্তা</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-emerald-50/70 text-lg md:text-xl font-medium italic max-w-2xl mx-auto"
           >
             আমাদের নিয়মিত স্বাস্থ্যবিষয়ক পরামর্শ এবং খাঁটি পণ্য সম্পর্কে জানতে নিয়মিত চোখ রাখুন আমাদের ব্লগে।
           </motion.p>
        </div>
      </section>

      {/* Blog Container */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
              </div>
            )}

            {/* Featured Post (First one) */}
            {!loading && featuredPost ? (
              <article className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-brand-green/5 border border-emerald-50 group">
                <Link href={`/blogs/${featuredPost.slug}`}>
                  <div className="relative h-[400px] md:h-[500px]">
                    <Image 
                      src={featuredPost.featuredImage || 'https://picsum.photos/seed/blog/800/600'} 
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10 space-y-4">
                       <span className="bg-brand-green text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                         Featured Post
                       </span>
                       <h2 className="text-2xl md:text-4xl font-black text-white italic leading-tight group-hover:text-emerald-300 transition-colors">
                         {featuredPost.title}
                       </h2>
                       <div className="flex items-center gap-6 text-white/70 text-xs font-bold italic">
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                          <span className="flex items-center gap-1.5"><User size={14} /> {featuredPost.author}</span>
                       </div>
                    </div>
                  </div>
                </Link>
              </article>
            ) : !loading && (
              <div className="py-20 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200">
                <p className="text-slate-400 italic">কোনো পোস্ট পাওয়া যায়নি।</p>
              </div>
            )}

            {/* Post List Grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {remainingPosts.map((post) => (
                <motion.article 
                  key={post._id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[3rem] overflow-hidden border border-emerald-50 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image 
                      src={post.featuredImage || 'https://picsum.photos/seed/blog/800/600'} 
                      alt={post.title} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {post.category && (
                      <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-brand-green-dark text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border border-emerald-100 italic">
                        {post.category}
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-black text-brand-green-dark group-hover:text-brand-green transition-colors leading-tight italic">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm italic leading-relaxed line-clamp-3">
                      {post.excerpt || post.title}
                    </p>
                    <div className="pt-4 mt-auto">
                      <Link href={`/blogs/${post.slug}`} className="flex items-center gap-2 text-brand-green font-black text-xs uppercase tracking-widest group/btn hover:underline underline-offset-4">
                        বিস্তারিত পড়ুন <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-8">
               <div className="flex gap-2">
                  <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-brand-green border border-emerald-100 shadow-sm hover:bg-brand-green hover:text-white transition-all">১</button>
                  <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-emerald-50 hover:border-brand-green hover:text-brand-green transition-all">২</button>
                  <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-emerald-50 hover:border-brand-green hover:text-brand-green transition-all"><ArrowRight size={20} /></button>
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Search Widget */}
            <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-6">
              <h4 className="text-xl font-black text-brand-green-dark italic flex items-center gap-2">
                <Search size={20} className="text-brand-green" /> অনুসন্ধান
              </h4>
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="কি খুঁজছেন..."
                   className="w-full bg-[#f9fafb] border-none rounded-2xl py-3.5 px-6 text-sm italic focus:ring-2 focus:ring-brand-green outline-none"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-6">
               <h4 className="text-xl font-black text-brand-green-dark italic flex items-center gap-2">
                 <TrendingUp size={20} className="text-brand-green" /> ক্যাটাগরি
               </h4>
               <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full flex items-center justify-between group py-1 transition-colors ${selectedCategory === 'All' ? 'text-brand-green' : 'text-slate-500'}`}
                  >
                    <span className="font-bold italic flex items-center gap-2">
                      <ChevronRight size={14} className={`transition-transform ${selectedCategory === 'All' ? 'translate-x-1' : ''}`} />
                      সবগুলো দেখুন
                    </span>
                    <span className="bg-emerald-50 text-brand-green font-black text-[10px] w-8 h-6 rounded-lg flex items-center justify-center">
                      {blogPosts.length}
                    </span>
                  </button>
                  {categories.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedCategory(cat as string)}
                      className={`w-full flex items-center justify-between group py-1 transition-colors ${selectedCategory === cat ? 'text-brand-green' : 'text-slate-500'}`}
                    >
                      <span className="font-bold italic flex items-center gap-2">
                        <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat ? 'translate-x-1' : ''}`} />
                        {cat}
                      </span>
                      <span className="bg-emerald-50 text-brand-green font-black text-[10px] w-8 h-6 rounded-lg flex items-center justify-center">
                        {blogPosts.filter(p => p.category === cat).length}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-8">
               <h4 className="text-xl font-black text-brand-green-dark italic flex items-center gap-2">
                 সাম্প্রতিক পোস্ট
               </h4>
               <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <Link key={post._id} href={`/blogs/${post.slug}`} className="flex gap-4 group items-center">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
                        <Image src={post.featuredImage || 'https://picsum.photos/seed/blog/200/200'} alt={post.title} fill className="object-cover group-hover:scale-110 transition-all" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-black text-sm text-brand-green-dark line-clamp-2 leading-snug group-hover:text-brand-green transition-colors italic">{post.title}</h5>
                        <p className="text-[#94a3b8] text-[10px] font-black uppercase tracking-widest">{formatDate(post.publishedAt || post.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
               </div>
            </div>

            {/* Newsletter widget */}
            <div className="bg-brand-green-dark p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <Mail size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white italic">সাবস্ক্রাইব করুন</h4>
                    <p className="text-emerald-50/60 text-xs italic font-medium">সপ্তাহের সেরা ব্লগ পোস্ট এবং বিশেষ অফারগুলো সরাসরি ইমেইলে পান।</p>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="আপনার ইমেইল"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-3.5 px-6 text-sm text-white italic outline-none focus:border-brand-green transition-colors placeholder:text-white/20"
                    />
                    <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-400 transition-all uppercase tracking-widest">
                       জয়েন করুন
                    </button>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>

            {/* Popular Tags Widget */}
            <div className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-sm space-y-6">
               <h4 className="text-xl font-black text-brand-green-dark italic flex items-center gap-2">
                 <Tag size={20} className="text-brand-green" /> ট্যাগ্স
               </h4>
               <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogPosts.flatMap(post => post.tags || []))).slice(0, 9).map((tag, i) => (
                    <Link key={i} href="#" className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 hover:border-brand-green hover:text-brand-green transition-all">
                      #{tag}
                    </Link>
                  ))}
                  {blogPosts.length === 0 && (
                    <span className="text-slate-400 text-sm italic">কোনো ট্যাগ নেই</span>
                  )}
               </div>
            </div>

          </aside>

        </div>
      </section>

      <Footer />
    </main>
  );
}
