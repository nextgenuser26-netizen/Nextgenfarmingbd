'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/AuthContext';

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const [baseProduct, setBaseProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchAllProducts();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?id=${id}`);
      const data = await res.json();
      setBaseProduct(data.product || data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setAllProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('অনুগ্রহ করে রিভিউ দেওয়ার জন্য লগইন করুন', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('অনুগ্রহ করে আপনার মতামত লিখুন', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
      return;
    }

    setSubmittingReview(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          userId: user.id,
          userName: user.name,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      toast.success('রিভিউ সফলভাবে জমা হয়েছে!', {
        style: {
          borderRadius: '1.5rem',
          background: '#064e3b',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });

      setReviewComment('');
      setReviewRating(5);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'রিভিউ জমা দিতে ব্যর্থ হয়েছে', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !editingReview) return;

    if (!editComment.trim()) {
      toast.error('অনুগ্রহ করে আপনার মতামত লিখুন', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
      return;
    }

    setSubmittingEdit(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: editingReview._id,
          userId: user.id,
          rating: editRating,
          comment: editComment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update review');
      }

      toast.success('রিভিউ সফলভাবে আপডেট হয়েছে!', {
        style: {
          borderRadius: '1.5rem',
          background: '#064e3b',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });

      setEditingReview(null);
      setEditComment('');
      setEditRating(5);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'রিভিউ আপডেট করতে ব্যর্থ হয়েছে', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই রিভিউটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete review');
      }

      toast.success('রিভিউ সফলভাবে মুছে ফেলা হয়েছে!', {
        style: {
          borderRadius: '1.5rem',
          background: '#064e3b',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });

      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'রিভিউ মুছে ফেলতে ব্যর্থ হয়েছে', {
        style: {
          borderRadius: '1.5rem',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '12px 24px'
        },
      });
    }
  };

  // Derive full product details from base product data
  const product = useMemo(() => {
    if (!baseProduct) return null;

    return {
      ...baseProduct,
      id: baseProduct._id || baseProduct.id,
      status: baseProduct.inStock ? 'In Stock' : 'Out of Stock',
      description: baseProduct.description || `${baseProduct.name} - এটি আমাদের একটি প্রিমিয়াম গুণমানের পণ্য। সরাসরি মাঠ থেকে সংগৃহীত এবং স্বাস্থ্যসম্মত উপায়ে প্রস্তুতকৃত।`,
      features: [
        '১০০% খাঁটি ও গুণগত মান সম্পন্ন',
        'কোনো ভেজাল বা প্রিজারভেটিভ নেই',
        'স্বাস্থ্যসম্মত উপায়ে প্যাকেটজাত',
        'পারফেক্ট স্বাদের নিশ্চয়তা'
      ],
      variants: baseProduct.variants || [],
      images: (baseProduct.images && baseProduct.images.length > 0)
        ? baseProduct.images
        : (baseProduct.image
            ? [
                baseProduct.image,
                `https://picsum.photos/seed/${baseProduct._id || baseProduct.id}-2/800/800`,
                `https://picsum.photos/seed/${baseProduct._id || baseProduct.id}-3/800/800`
              ]
            : []),
      galleryImages: (baseProduct.galleryImages && baseProduct.galleryImages.length > 0)
        ? baseProduct.galleryImages
        : [],
      mainImageIndex: baseProduct.mainImageIndex ?? 0,
      details: baseProduct.details || '',
      deliveryInfo: 'ঢাকার ভেতরে অথবা ১০০০০ টাকার উপরে কেনাকাটায় ফ্রি ডেলিভারি! ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে কুরিয়ারের মাধ্যমে আমরা পণ্য প্রতিটি জেলায় পৌঁছে দিয়ে থাকি।'
    };
  }, [baseProduct]);

  // Get related products from the same category
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    
    const currentCategory = product.category;
    if (!currentCategory) return [];
    
    // Filter products from the same category, excluding the current product
    return allProducts
      .filter((p: any) => p.category === currentCategory && p._id !== product.id)
      .slice(0, 4)
      .map((p: any) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image || p.images?.[0] || 'https://picsum.photos/seed/product/400/400'
      }));
  }, [product, allProducts]);

  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showSuccess, setShowSuccess] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { addToCart, setIsDrawerOpen } = useCart();

  useEffect(() => {
    if (product) {
      const mainIndex = product.mainImageIndex ?? 0;
      setMainImage(product.images[Math.min(mainIndex, product.images.length - 1)] || '');

      // Initialize selected variant if product has variants
      if (product.hasVariants && product.variants && product.variants.length > 0) {
        // Select first in-stock variant
        const firstInStockVariant = product.variants.find((v: any) => v.inStock);
        setSelectedVariant(firstInStockVariant || product.variants[0]);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold italic">Loading product...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc') setQuantity(q => q + 1);
    else if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if variant is selected and in stock
    if (product.hasVariants) {
      if (!selectedVariant) {
        toast.error('অনুগ্রহ করে একটি পরিমাণ নির্বাচন করুন', {
          style: {
            borderRadius: '1.5rem',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 24px'
          },
        });
        return;
      }
      if (!selectedVariant.inStock) {
        toast.error('নির্বাচিত পরিমাণটি স্টক আউট', {
          style: {
            borderRadius: '1.5rem',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 24px'
          },
        });
        return;
      }
    }

    const productImage = product.images?.[0] || product.image || '';

    // Use variant price if selected, otherwise use base price
    const price = selectedVariant ? selectedVariant.price : product.price;
    const variantName = selectedVariant ? selectedVariant.name : '';
    const variantId = selectedVariant ? `${product.id}-${selectedVariant.name}` : product.id;

    addToCart({
      id: variantId,
      name: product.name,
      price: price,
      quantity: quantity,
      image: productImage,
      variant: variantName
    });

    setIsDrawerOpen(true);

    toast.success('সফলভাবে কার্টে যোগ করা হয়েছে!', {
      style: {
        borderRadius: '1.5rem',
        background: '#064e3b',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '12px 24px'
      },
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Check if variant is selected and in stock
    if (product.hasVariants) {
      if (!selectedVariant) {
        toast.error('অনুগ্রহ করে একটি পরিমাণ নির্বাচন করুন', {
          style: {
            borderRadius: '1.5rem',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 24px'
          },
        });
        return;
      }
      if (!selectedVariant.inStock) {
        toast.error('নির্বাচিত পরিমাণটি স্টক আউট', {
          style: {
            borderRadius: '1.5rem',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px 24px'
          },
        });
        return;
      }
    }

    const productImage = product.images?.[0] || product.image || '';

    // Use variant price if selected, otherwise use base price
    const price = selectedVariant ? selectedVariant.price : product.price;
    const variantName = selectedVariant ? selectedVariant.name : '';
    const variantId = selectedVariant ? `${product.id}-${selectedVariant.name}` : product.id;

    addToCart({
      id: variantId,
      name: product.name,
      price: price,
      quantity: quantity,
      image: productImage,
      variant: variantName
    });

    router.push('/checkout');
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
           <h2 className="text-3xl font-black text-brand-green-dark italic">দুঃখিত, পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
           <p className="text-slate-500 font-bold italic">আপনার পছন্দের পণ্যটি খুঁজতে পুনরায় চেষ্টা করুন।</p>
           <Link href="/shop" className="inline-block bg-brand-green text-white px-10 py-4 rounded-full font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
             শপে ফিরে যান
           </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-bold italic">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-green-dark truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Product Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="space-y-4">
               <motion.div 
                 ref={containerRef}
                 layoutId="main-image"
                 onMouseMove={handleMouseMove}
                 onMouseEnter={() => setIsZoomed(true)}
                 onMouseLeave={() => setIsZoomed(false)}
                 onClick={() => setIsLightboxOpen(true)}
                 className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-emerald-50 shadow-xl cursor-zoom-in"
               >
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                      style={{ transformOrigin: zoomOrigin }}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {selectedVariant && selectedVariant.oldPrice && selectedVariant.oldPrice > selectedVariant.price && (
                    <div className="absolute top-6 left-6 bg-brand-red text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                      {Math.round(((selectedVariant.oldPrice - selectedVariant.price) / selectedVariant.oldPrice) * 100)}% OFF
                    </div>
                  )}
                  {!selectedVariant && product.oldPrice && product.oldPrice > product.price && (
                    <div className="absolute top-6 left-6 bg-brand-red text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </div>
                  )}
               </motion.div>

               <div className="flex gap-4">
                  {[...product.images, ...product.galleryImages].map((img: string, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-brand-green shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                    <Star size={14} fill="currentColor" /> {product.rating}
                 </div>
                 <span className="text-slate-400 text-xs font-bold italic">{product.reviews} কাস্টমার রিভিউ</span>
                 <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                 <span className="text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={14} /> {selectedVariant ? (selectedVariant.inStock ? 'In Stock' : 'Out of Stock') : product.status}
                 </span>
               </div>
               
               <h1 className="text-3xl md:text-5xl font-black text-brand-green-dark italic leading-tight">
                  {product.name}
               </h1>

               <div className="flex items-end gap-4">
                  <span className="text-4xl md:text-5xl font-black text-brand-green tracking-tighter italic">
                    ৳{(selectedVariant ? selectedVariant.price : product.price) * quantity}
                  </span>
                  {selectedVariant && selectedVariant.oldPrice && selectedVariant.oldPrice > selectedVariant.price && (
                    <span className="text-xl text-slate-300 line-through font-bold mb-1">৳{selectedVariant.oldPrice * quantity}</span>
                  )}
                  {!selectedVariant && product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-xl text-slate-300 line-through font-bold mb-1">৳{product.oldPrice * quantity}</span>
                  )}
               </div>

               <p className="text-slate-500 italic leading-relaxed text-sm md:text-base font-medium">
                  {product.description}
               </p>
            </div>

            {/* Selection Options */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
               {product.hasVariants && product.variants && product.variants.length > 0 && (
                 <div className="space-y-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">পরিমাণ নির্বাচন করুন (Variant)</span>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.inStock}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${selectedVariant?.name === variant.name ? 'bg-brand-green-dark border-brand-green-dark text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-brand-green'} ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {variant.name}
                        {variant.name_en && <span className="text-xs opacity-70 ml-1">({variant.name_en})</span>}
                        {variant.oldPrice && variant.oldPrice > variant.price && (
                          <span className="ml-1 text-xs text-red-500 line-through">৳{variant.oldPrice}</span>
                        )}
                        {!variant.inStock && <span className="ml-1 text-xs text-red-500">(স্টক আউট)</span>}
                      </button>
                    ))}
                  </div>
               </div>
               )}

               <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                  <div className="flex items-center bg-white border-2 border-slate-50 rounded-2xl p-1.5 shadow-sm w-full sm:w-auto">
                    <button 
                      onClick={() => handleQuantity('dec')}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-green transition-colors"
                    >
                       <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-lg text-brand-green-dark">{quantity}</span>
                    <button 
                      onClick={() => handleQuantity('inc')}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-green transition-colors"
                    >
                       <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-brand-green-dark text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-brand-green/10 hover:bg-brand-green transition-all"
                    >
                      <ShoppingCart size={20} /> কার্টে যোগ করুন
                    </button>
                    <button className="w-14 h-14 border-2 border-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-50 transition-all bg-white group">
                       <Heart size={24} className="group-hover:fill-current" />
                    </button>
                  </div>
               </div>
               
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-700/10 hover:bg-emerald-500 transition-all"
                >
                  এখনই কিনুন (Buy Now)
                </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-brand-green"><ShieldCheck size={20} /></div>
                  <div className="space-y-0.5">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guaranteed</h5>
                    <p className="text-xs font-black text-brand-green-dark">১০০% বিশুদ্ধতা</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Truck size={20} /></div>
                  <div className="space-y-0.5">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fast Delivery</h5>
                    <p className="text-xs font-black text-brand-green-dark">দ্রুত ডেলিভারি</p>
                  </div>
               </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share this:</span>
               <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-white border border-slate-50 text-slate-400 hover:text-brand-green transition-all shadow-sm"><Share2 size={16} /></button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Detailed Info */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm overflow-hidden">
           <div className="flex border-b border-slate-50">
              {['description', 'details', 'delivery'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-6 md:px-12 py-6 text-xs md:text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-brand-green border-b-2 border-brand-green bg-emerald-50/30' : 'text-slate-400 hover:text-brand-green'}`}
                >
                  {tab === 'description' ? 'বিবরণ' : tab === 'details' ? 'বিস্তারিত' : 'ডেলিভারি'}
                </button>
              ))}
           </div>
           <div className="p-8 md:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-4xl"
                >
                   {activeTab === 'description' && (
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-brand-green-dark italic">পণ্য সম্পর্কে কিছু কথা</h3>
                        <p className="text-slate-500 italic leading-relaxed text-lg">{product.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          {product.features.map((f: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-slate-600 font-bold italic">
                               <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-brand-green"><CheckCircle2 size={14} /></div>
                               {f}
                            </div>
                          ))}
                        </div>
                     </div>
                   )}
                   {activeTab === 'details' && (
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-brand-green-dark italic">বিস্তারিত বর্ণনা</h3>
                        {product.details ? (
                          <p className="text-slate-500 italic leading-relaxed text-lg">{product.details}</p>
                        ) : (
                          <p className="text-slate-400 italic text-lg">বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।</p>
                        )}
                     </div>
                   )}
                   {activeTab === 'delivery' && (
                     <div className="space-y-6">
                        <h3 className="text-2xl font-black text-brand-green-dark italic">ডেলিভারি তথ্য</h3>
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 flex gap-4">
                           <AlertCircle className="text-blue-500 shrink-0" />
                           <p className="text-blue-800 italic font-medium">{product.deliveryInfo}</p>
                        </div>
                     </div>
                   )}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm p-8 md:p-16">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-brand-green-dark italic">কাস্টমার রিভিউ</h2>
              <p className="text-slate-400 font-bold italic">আমাদের গ্রাহকদের মতামত</p>
            </div>

            {/* Review Form */}
            <div className="bg-[#f9faf5] rounded-[2.5rem] p-8 border border-emerald-50">
              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">রেটিং দিন</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-3xl transition-all ${star <= reviewRating ? 'text-amber-400' : 'text-slate-200'} hover:text-amber-400`}
                        >
                          <Star size={32} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest">আপনার মতামত</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="পণ্যটি সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
                      className="w-full bg-white border-2 border-emerald-50 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-brand-green outline-none resize-none h-32"
                      maxLength={500}
                    />
                    <p className="text-xs text-slate-400 text-right">{reviewComment.length}/500</p>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-brand-green text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-brand-green/10 hover:bg-brand-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <p className="text-slate-500 font-bold italic">রিভিউ দেওয়ার জন্য অনুগ্রহ করে লগইন করুন</p>
                  <Link href="/login" className="inline-block bg-brand-green text-white px-8 py-3 rounded-full font-black text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
                    লগইন করুন
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review._id} className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-black text-lg">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-brand-green-dark">{review.userName}</h4>
                          <p className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= review.rating ? 'text-amber-400' : 'text-slate-200'}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        {user && review.userId === user.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="text-brand-green hover:text-brand-green-dark transition-colors"
                              title="Edit review"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                              title="Delete review"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl">
                  <p className="text-slate-400 italic">এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
                </div>
              )}
            </div>

            {/* Edit Review Modal */}
            {editingReview && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-brand-green-dark italic">রিভিউ এডিট করুন</h3>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleUpdateReview} className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest">রেটিং দিন</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className={`text-3xl transition-all ${star <= editRating ? 'text-amber-400' : 'text-slate-200'} hover:text-amber-400`}
                          >
                            <Star size={32} fill={star <= editRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest">আপনার মতামত</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="পণ্যটি সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
                        className="w-full bg-white border-2 border-emerald-50 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-brand-green outline-none resize-none h-32"
                        maxLength={500}
                      />
                      <p className="text-xs text-slate-400 text-right">{editComment.length}/500</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setEditingReview(null)}
                        className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        disabled={submittingEdit}
                        className="flex-1 bg-brand-green text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-brand-green/10 hover:bg-brand-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingEdit ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="bg-white py-24 border-t border-emerald-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex justify-between items-end mb-16 px-4">
             <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-brand-green-dark italic">আরও কিছু পণ্য</h2>
                <p className="text-slate-400 font-bold italic">আপনার পছন্দের সাথে মিল রেখে খুঁজে নিন আরও খাঁটি উপহার</p>
             </div>
             <Link href="/shop" className="hidden md:flex items-center gap-2 text-brand-green font-black italic hover:underline">
               সব দেখুন <ArrowLeft className="rotate-180" size={20} />
             </Link>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <Link key={p._id} href={`/shop/${p._id}`} className="group space-y-4">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm group-hover:shadow-xl transition-all">
                    <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="px-4 space-y-1">
                    <h4 className="text-lg font-black text-brand-green-dark italic truncate">{p.name}</h4>
                    <p className="text-brand-green font-black italic">৳{p.price}</p>
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
             <button 
               onClick={() => setIsLightboxOpen(false)}
               className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
             >
                <Plus size={32} className="rotate-45" />
             </button>
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-5xl aspect-square"
               onClick={(e) => e.stopPropagation()}
             >
                {mainImage && (
                  <Image 
                    src={mainImage} 
                    alt={product.name} 
                    fill 
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-brand-green-dark text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black italic text-sm md:text-base border border-white/20 backdrop-blur-md"
          >
            <div className="bg-white text-brand-green p-1 rounded-full">
              <CheckCircle2 size={16} />
            </div>
            সফলভাবে কার্টে যোগ করা হয়েছে!
            <Link href="/cart" className="ml-2 underline underline-offset-4 hover:text-emerald-300 transition-colors">কার্ট দেখুন</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
