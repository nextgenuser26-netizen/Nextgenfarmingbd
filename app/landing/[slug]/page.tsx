'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, ChevronRight, Check, ArrowRight, ShoppingCart, User, Phone, MapPin, Package, CreditCard, CheckCircle2, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function LandingPage() {
  const params = useParams();
  const [landingPage, setLandingPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    notes: ''
  });

  useEffect(() => {
    fetchLandingPage();
    fetchSettings();
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      const parsedCustomer = JSON.parse(storedCustomer);
      setCustomer(parsedCustomer);
      setFormData(prev => ({
        ...prev,
        name: parsedCustomer.name || '',
        phone: parsedCustomer.phone || ''
      }));
    }
  }, [params.slug]);

  const fetchLandingPage = async () => {
    try {
      const res = await fetch(`/api/landing-pages?status=published`);
      const data = await res.json();
      const page = data.landingPages?.find((p: any) => p.slug === params.slug);
      
      if (!page) {
        notFound();
        return;
      }
      
      setLandingPage(page);
      setQuantity(page.defaultQuantity || 1);
      
      // Fetch product if productId is set
      if (page.productId) {
        fetchProduct(page.productId);
      }
    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products?id=${productId}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const getPrice = () => {
    if (landingPage?.customPrice) {
      return parseFloat(landingPage.customPrice);
    }
    return product?.price || 0;
  };

  const getDiscountPrice = () => {
    if (landingPage?.discountPrice) {
      return parseFloat(landingPage.discountPrice);
    }
    return 0;
  };

  const getFinalPrice = () => {
    const price = getPrice();
    const discount = getDiscountPrice();
    return Math.max(0, discount || price);
  };

  const calculateShipping = () => {
    const price = getFinalPrice() * quantity;
    const isInsideDhaka = formData.city === 'Dhaka';
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 5000;
    const isFreeShipping = price >= freeShippingThreshold;

    if (isFreeShipping) return 0;
    return isInsideDhaka ? (settings?.shippingCostInsideDhaka ?? 60) : (settings?.shippingCostOutsideDhaka ?? 150);
  };

  const getTotal = () => {
    const price = getFinalPrice() * quantity;
    const shipping = calculateShipping();
    return price + shipping;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) {
      toast.error('পণ্য পাওয়া যায়নি');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য প্রদান করুন।');
      return;
    }

    toast.loading('অর্ডার প্রসেস করা হচ্ছে...', { id: 'order-loading' });
    
    try {
      const orderData = {
        userId: customer?.id || 'guest',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: '',
        items: [{
          productId: product._id || product.id || '',
          name: product.name,
          name_en: product.name,
          price: getFinalPrice(),
          quantity: quantity,
          image: product.images?.[0] || product.image || ''
        }],
        totalAmount: getTotal(),
        deliveryCharge: calculateShipping(),
        discountAmount: getDiscountPrice() ? (getPrice() - getDiscountPrice()) * quantity : 0,
        couponCode: '',
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.city,
          zipCode: '0000',
          country: 'Bangladesh'
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        notes: formData.notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      toast.dismiss('order-loading');
      setIsOrdered(true);
      setCreatedOrder(result);
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
      window.scrollTo(0, 0);
    } catch (error) {
      toast.dismiss('order-loading');
      console.error('Error creating order:', error);
      toast.error('অর্ডার তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleDownloadReceipt = () => {
    if (!createdOrder) return;
    
    const receiptContent = `
      <html>
        <head>
          <title>Order Receipt - ${createdOrder.orderNumber || createdOrder._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              max-width: 700px;
              margin: 0 auto;
              background: #fff;
            }
            .company-header {
              text-align: center;
              border-bottom: 3px solid #10b981;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #10b981;
            }
            .header h1 {
              color: #10b981;
              margin: 0;
              font-size: 24px;
            }
            .order-info {
              background: #f0fdf4;
              padding: 15px;
              border-radius: 10px;
              margin-bottom: 15px;
            }
            .section {
              margin: 15px 0;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0fdf4;
              color: #059669;
            }
            .total {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
            }
          </style>
        </head>
        <body>
          <div class="company-header">
            <div class="company-name">${settings?.siteName || 'NextGen FarmingBD'}</div>
          </div>
          <div class="header">
            <h1>🛒 Order Receipt</h1>
          </div>
          <div class="order-info">
            <p><strong>Order Number:</strong> ${createdOrder.orderNumber || createdOrder._id}</p>
            <p><strong>Order Date:</strong> ${new Date(createdOrder.createdAt).toLocaleString()}</p>
          </div>
          <div class="section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${createdOrder.customerName}</p>
            <p><strong>Phone:</strong> ${createdOrder.customerPhone}</p>
          </div>
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${createdOrder.items?.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>৳${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>৳${item.price * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p class="total">Total: ৳${createdOrder.totalAmount}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isOrdered) {
    return (
      <main className="min-h-screen bg-[#fcfdfa]">
        <Header />
        <section className="max-w-3xl mx-auto px-4 py-20 md:py-32 text-center space-y-10">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-24 h-24 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-green/20"
           >
              <CheckCircle2 size={48} />
           </motion.div>
           
           <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-brand-green-dark italic tracking-tighter">অভিনন্দন!</h1>
              <p className="text-xl text-slate-600 font-bold italic">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।</p>
           </div>
           
           <div className="bg-white border border-emerald-50 rounded-[3rem] p-10 shadow-sm max-w-xl mx-auto space-y-6">
              <p className="text-slate-500 font-medium italic leading-relaxed">
                আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন অর্ডারটি নিশ্চিত করার জন্য। ততক্ষণ পর্যন্ত আমাদের সাথেই থাকুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   onClick={handleDownloadReceipt}
                   className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black italic shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-all"
                 >
                    <Download size={20} />
                    রসিদ ডাউনলোড করুন
                 </button>
                 {customer && (
                   <Link href="/customer-dashboard" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black italic shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all">
                      <User size={20} />
                      ড্যাশবোর্ডে যান
                   </Link>
                 )}
                 <Link href="/shop" className="bg-brand-green text-white px-8 py-4 rounded-2xl font-black italic shadow-lg shadow-brand-green/10 hover:bg-brand-green-dark transition-all">শপিং চালিয়ে যান</Link>
                 <Link href="/" className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black italic hover:bg-slate-200 transition-all">হোম পেজ</Link>
              </div>
           </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!landingPage) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {landingPage.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={landingPage.heroImage}
              alt={landingPage.heroTitle}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white italic leading-tight mb-6">
              {landingPage.heroTitle}
            </h1>
            {landingPage.heroSubtitle && (
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {landingPage.heroSubtitle}
              </p>
            )}
            {landingPage.heroCtaText && landingPage.heroCtaLink && (
              <Link
                href={landingPage.heroCtaLink}
                className="inline-flex items-center px-8 py-4 bg-white text-brand-green-dark font-black rounded-2xl hover:bg-brand-green hover:text-white transition-all text-lg"
              >
                {landingPage.heroCtaText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      {landingPage.contentSections && landingPage.contentSections.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <div className="space-y-20">
            {landingPage.contentSections
              .sort((a: any, b: any) => a.order - b.order)
              .map((section: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}
                >
                  <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                    <h2 className="text-3xl md:text-4xl font-black text-brand-green-dark italic mb-6">
                      {section.title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  {section.image && (
                    <div className={index % 2 === 1 ? 'md:col-start-1' : ''}>
                      <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={section.image}
                          alt={section.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* Features */}
      {landingPage.features && landingPage.features.length > 0 && (
        <section className="py-20 bg-brand-green-dark">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white italic mb-4">
                কেন আমাদের পণ্য সেরা?
              </h2>
              <p className="text-emerald-100 text-lg">
                আমাদের পণ্যের বিশেষ বৈশিষ্ট্যগুলো জানুন
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {landingPage.features.map((feature: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center"
                >
                  {feature.icon && (
                    <div className="text-5xl mb-4">{feature.icon}</div>
                  )}
                  <h3 className="text-xl font-black text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-emerald-100">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {landingPage.testimonials && landingPage.testimonials.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-brand-green-dark italic mb-4">
              গ্রাহকদের মতামত
            </h2>
            <p className="text-gray-600 text-lg">
              আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {landingPage.testimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  {testimonial.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-brand-green-dark">{testimonial.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {landingPage.faq && landingPage.faq.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-black text-brand-green-dark italic mb-4">
                সাধারণ প্রশ্নাবলী
              </h2>
              <p className="text-gray-600 text-lg">
                আপনার প্রশ্নের উত্তর খুঁজুন
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {landingPage.faq.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-50"
                >
                  <h3 className="font-bold text-lg text-brand-green-dark mb-3 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-brand-green" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600 pl-7">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section with Checkout */}
      {product && landingPage?.enableCheckout && (
        <section className="py-20 bg-brand-green">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Product Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-black text-white italic">
                  {landingPage.checkoutTitle || 'এখনই অর্ডার করুন'}
                </h2>
                {landingPage.checkoutSubtitle && (
                  <p className="text-emerald-100 text-lg">
                    {landingPage.checkoutSubtitle}
                  </p>
                )}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    {product.images?.[0] || product.image && (
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        {getDiscountPrice() > 0 && (
                          <span className="text-white/60 line-through">৳{getPrice()}</span>
                        )}
                        <span className="text-2xl font-black text-emerald-300">৳{getFinalPrice()}</span>
                      </div>
                    </div>
                  </div>
                  {landingPage.showQuantity && (
                    <div className="flex items-center gap-4">
                      <label className="text-white font-medium">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white font-bold w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right: Checkout Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <form onSubmit={handleCheckout} className="bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-green-dark">শিপিং তথ্য</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">আপনার নাম *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="পুরো নাম লিখুন"
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">মোবাইল নম্বর *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="০১XXXXXXXXX"
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">ঠিকানা *</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-6 top-6 text-slate-300" />
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={3}
                          placeholder="আপনার বিস্তারিত ঠিকানা লিখুন"
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">শহর</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none font-bold appearance-none"
                      >
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                        <option value="Outside">Other Districts</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">পণ্যের মূল্য</span>
                      <span className="font-bold text-slate-800">৳{getPrice() * quantity}</span>
                    </div>
                    {getDiscountPrice() > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>ছাড়</span>
                        <span className="font-bold">-৳{(getPrice() - getDiscountPrice()) * quantity}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">ডেলিভারি চার্জ</span>
                      <span className="font-bold text-slate-800">৳{calculateShipping()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">সর্বমোট</span>
                      <span className="text-2xl font-black text-brand-green">৳{getTotal()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-green text-white py-4 rounded-2xl font-black italic shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-all text-lg"
                  >
                    অর্ডার কনফার্ম করুন
                  </button>

                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <CreditCard size={16} />
                    <span>ক্যাশ অন ডেলিভারি (COD)</span>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Fallback CTA Section for non-checkout pages */}
      {product && !landingPage?.enableCheckout && (
        <section className="py-20 bg-brand-green">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white italic">
                এখনই অর্ডার করুন
              </h2>
              <p className="text-emerald-100 text-lg">
                {product.name} - ৳{product.price}
              </p>
              <Link
                href={`/shop/${product._id || product.id}`}
                className="inline-flex items-center px-8 py-4 bg-white text-brand-green-dark font-black rounded-2xl hover:bg-emerald-50 transition-all text-lg"
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                বিস্তারিত দেখুন
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
