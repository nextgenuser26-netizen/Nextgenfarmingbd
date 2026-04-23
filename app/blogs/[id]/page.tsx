'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, Bookmark, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  title_en?: string;
  slug: string;
  excerpt?: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  featuredImage?: string;
  author: string;
  tags?: string[];
  category?: string;
  status: string;
  publishedAt?: Date;
  createdAt: Date;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${params.id}`);
      const data = await res.json();
      
      if (res.ok && data.blog) {
        setPost(data.blog);
      } else {
        console.error('Blog not found:', data.error);
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-brand-green-dark">পোস্টটি পাওয়া যায়নি</h1>
          <button onClick={() => router.push('/blogs')} className="text-brand-green font-bold flex items-center gap-2 mx-auto">
            <ArrowLeft size={18} /> ব্লগে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-0">
      <Header />
      
      {/* Blog Hero */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden">
        <Image 
          src={post.featuredImage || 'https://picsum.photos/seed/blog/1200/800'} 
          alt={post.title}
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-8 pb-16 space-y-6 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              {post.category && (
                <span className="bg-brand-green text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                  {post.category}
                </span>
              )}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-6xl font-black text-white italic leading-tight"
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-8 pt-4 border-t border-white/10"
            >
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-black">
                   {post.author[0]}
                 </div>
                 <div>
                   <p className="text-white font-bold text-sm leading-none italic">{post.author}</p>
                   <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">Author</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 text-white/60 text-sm italic">
                 <Calendar size={16} /> {formatDate(post.publishedAt || post.createdAt)}
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-20 max-w-4xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-16 relative">
          
          {/* Side Toolbar */}
          <aside className="lg:col-span-1 hidden lg:block sticky top-32 h-fit space-y-8">
             <div className="flex flex-col gap-4">
                <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-green hover:border-brand-green transition-all shadow-sm">
                  <Bookmark size={20} />
                </button>
                <div className="h-px bg-slate-100 w-8 mx-auto" />
                <button className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Twitter size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all">
                  <LinkIcon size={20} />
                </button>
             </div>
          </aside>

          {/* Body Content */}
          <div className="lg:col-span-11 space-y-12">
             <div className="prose prose-lg max-w-none prose-emerald select-none">
                <div className="text-slate-600 italic font-medium leading-relaxed whitespace-pre-line text-lg md:text-xl">
                  {post.content}
                </div>
                
                <div className="my-12 p-10 bg-emerald-50 rounded-[3rem] border border-brand-green/10 italic">
                   <h3 className="text-2xl font-black text-brand-green-dark mb-4">স্বাস্থ্যের জন্য বিশুদ্ধ পণ্য কেন জরুরী?</h3>
                   <p className="text-slate-600">
                     আজকের দিনে বিশুদ্ধ ও ভেজালমুক্ত স্বাস্থ্যসম্মত অর্গানিক পণ্য খুঁজে পাওয়া বেশ কঠিন হয়ে দাঁড়িয়েছে। কিন্তু সুস্থ দীর্ঘায়ূ লাভ করতে হলে বিশুদ্ধ খাবারের কোনো বিকল্প নেই। নেক্সটজেন FarmingBD সর্বদা চেষ্টা করে যাচ্ছে সেরা মানের পণ্য সরাসরি আপনাদের হাতে পৌঁছে দিতে।
                   </p>
                </div>

                <div className="text-slate-600 italic font-medium leading-relaxed whitespace-pre-line text-lg md:text-xl">
                   আপনার পরিবারের সুস্বাস্থ্য নিশ্চিত করতে আজই সংগ্রহ করুন আমাদের প্রিমিয়াম পণ্যসমূহ। ব্লগে নিয়মিত চোখ রাখুন স্বাস্থ্যের টুকিটাকি আরও টিপস পেতে।
                </div>
             </div>

             {/* Bottom bar */}
             <div className="pt-12 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-2">
                   {post.tags && post.tags.length > 0 ? post.tags.map((tag, i) => (
                     <span key={i} className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                       #{tag}
                     </span>
                   )) : (
                     <span className="text-slate-400 text-sm italic">কোনো ট্যাগ নেই</span>
                   )}
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-slate-400 text-xs font-bold italic flex items-center gap-2">
                     Share this article <Share2 size={14} />
                   </span>
                </div>
             </div>

             {/* Author Bio */}
             <div className="bg-[#fafbfc] p-10 rounded-[4rem] flex flex-col md:flex-row items-center gap-10 mt-20 border border-slate-50">
                <div className="w-24 h-24 bg-brand-green rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                   {post.author[0]}
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                   <h4 className="text-xl font-black text-brand-green-dark italic">{post.author}</h4>
                   <p className="text-slate-500 italic text-sm">
                      নেক্সটজেন FarmingBD-এর কন্টেন্ট ক্রিয়েটর এবং স্বাস্থ্য সচেতনতা বিষয়ক লেখক। তিনি দীর্ঘদিন ধরে খাঁটি কৃষি পণ্য এবং অর্গানিক লাইফস্টাইল নিয়ে কাজ করছেন।
                   </p>
                </div>
             </div>

             {/* Back button */}
             <div className="pt-10 flex justify-center lg:justify-start">
                <Link 
                  href="/blogs"
                  className="flex items-center gap-3 text-brand-green font-black text-sm uppercase tracking-widest hover:underline translate-y-0 hover:-translate-x-2 transition-all"
                >
                  <ArrowLeft size={20} /> ব্লগে ফিরে যান
                </Link>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
