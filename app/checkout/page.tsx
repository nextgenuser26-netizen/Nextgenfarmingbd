'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/CartContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  User,
  ShoppingBag,
  Download,
  Tag,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    notes: ''
  });

  useEffect(() => {
    // Fetch settings
    fetchSettings();

    // Check if customer is logged in
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

    // Check for pending coupon from deals page
    const pendingCoupon = localStorage.getItem('pendingCoupon');
    if (pendingCoupon) {
      setCouponCode(pendingCoupon);
      localStorage.removeItem('pendingCoupon');
    }
  }, []);

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('কুপন কোড লিখুন');
      return;
    }

    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      const deals = data.deals || [];

      const validDeal = deals.find((deal: any) =>
        deal.code?.toUpperCase() === couponCode.toUpperCase() &&
        new Date(deal.startDate) <= new Date() &&
        new Date(deal.endDate) >= new Date()
      );

      if (validDeal) {
        // Check minimum order value
        if (validDeal.minOrderValue && subtotal < validDeal.minOrderValue) {
          toast.error(`মিনিমাম অর্ডার ভ্যালু ৳${validDeal.minOrderValue} প্রয়োজন`);
          return;
        }

        // Calculate discount
        let discountAmount = 0;
        if (validDeal.discountType === 'percentage') {
          discountAmount = (subtotal * validDeal.discountValue) / 100;
        } else if (validDeal.discountType === 'fixed') {
          discountAmount = validDeal.discountValue;
        }

        // Check if discount exceeds subtotal
        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }

        setAppliedCoupon(validDeal);
        setDiscount(discountAmount);
        toast.success('কুপন সফলভাবে প্রয়োগ করা হয়েছে!');
      } else {
        toast.error('অবৈধ কুপন কোড');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('কুপন যাচাই করতে সমস্যা হয়েছে');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscount(0);
    toast.success('কুপন সরানো হয়েছে');
  };

  // Calculate shipping based on settings and free shipping threshold
  const { shipping, total, shippingCostInsideDhaka, shippingCostOutsideDhaka, freeShippingThreshold, isFreeShipping } = useMemo(() => {
    const shippingCostInsideDhaka = settings?.shippingCostInsideDhaka ?? 60;
    const shippingCostOutsideDhaka = settings?.shippingCostOutsideDhaka ?? 150;
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 5000;

    const isInsideDhaka = formData.city === 'Dhaka';
    const isFreeShipping = subtotal >= freeShippingThreshold;

    const shipping = isFreeShipping ? 0 : (isInsideDhaka ? shippingCostInsideDhaka : shippingCostOutsideDhaka);
    const total = subtotal + shipping - discount;

    return { shipping, total, shippingCostInsideDhaka, shippingCostOutsideDhaka, freeShippingThreshold, isFreeShipping };
  }, [settings, formData.city, subtotal, discount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadReceipt = () => {
    if (!createdOrder) return;
    
    const receiptContent = `
      <html>
        <head>
          <title>Order Receipt - ${createdOrder.orderNumber || createdOrder._id}</title>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                margin: 0.5cm;
                size: A4;
              }
              * {
                page-break-inside: avoid !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              max-width: 700px;
              margin: 0 auto;
              background: #fff;
              min-height: 100vh;
            }
            .company-header {
              text-align: center;
              border-bottom: 3px solid #10b981;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-logo {
              max-width: 150px;
              max-height: 80px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #10b981;
              margin: 10px 0;
            }
            .company-info {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .header {
              margin-bottom: 20px;
            }
            .header h1 {
              color: #10b981;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              color: #666;
              margin: 5px 0 0;
              font-size: 14px;
            }
            .order-info {
              background: #f0fdf4;
              padding: 15px;
              border-radius: 10px;
              margin-bottom: 15px;
            }
            .order-info h2 {
              color: #059669;
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-row {
              margin: 8px 0;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
            }
            .label {
              font-weight: bold;
              color: #374151;
            }
            .value {
              color: #1f2937;
            }
            .section {
              margin: 15px 0;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            }
            .section h2 {
              color: #059669;
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 8px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #f0fdf4;
              color: #059669;
              font-weight: bold;
            }
            .total-section {
              margin-top: 15px;
              text-align: right;
            }
            .total {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
            }
            .status {
              padding: 5px 12px;
              border-radius: 20px;
              display: inline-block;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-confirmed { background-color: #dbeafe; color: #1e40af; }
            .status-processing { background-color: #e5e7eb; color: #374151; }
            .status-shipped { background-color: #d1fae5; color: #065f46; }
            .status-delivered { background-color: #d1fae5; color: #065f46; }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="company-header">
            ${settings?.logo ? `<img src="${settings.logo}" alt="${settings.siteName}" class="company-logo" />` : ''}
            <div class="company-name">${settings?.siteName || 'NextGen FarmingBD'}</div>
            ${settings?.contactAddress ? `<div class="company-info">${settings.contactAddress}</div>` : ''}
            ${settings?.contactPhone ? `<div class="company-info">Phone: ${settings.contactPhone}</div>` : ''}
            ${settings?.contactEmail ? `<div class="company-info">Email: ${settings.contactEmail}</div>` : ''}
          </div>

          <div class="header">
            <h1>🛒 Order Receipt</h1>
          </div>

          <div class="order-info">
            <h2>Order Information</h2>
            <div class="info-row">
              <span class="label">Order Number:</span>
              <span class="value">${createdOrder.orderNumber || createdOrder._id}</span>
            </div>
            <div class="info-row">
              <span class="label">Order Date:</span>
              <span class="value">${new Date(createdOrder.createdAt).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value"><span class="status status-${createdOrder.status}">${createdOrder.status}</span></span>
            </div>
          </div>

          <div class="section">
            <h2>Customer Information</h2>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${createdOrder.customerName}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${createdOrder.customerPhone}</span>
            </div>
            ${createdOrder.customerEmail ? `
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${createdOrder.customerEmail}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Shipping Address</h2>
            <p>${createdOrder.shippingAddress?.street}, ${createdOrder.shippingAddress?.city}, ${createdOrder.shippingAddress?.state}, ${createdOrder.shippingAddress?.zipCode}, ${createdOrder.shippingAddress?.country}</p>
          </div>

          <div class="section">
            <h2>Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${createdOrder.items?.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.variant || '-'}</td>
                    <td>৳${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>৳${item.price * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total-section">
              <div class="info-row">
                <span class="label">Subtotal:</span>
                <span class="value">৳${createdOrder.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
              </div>
              <div class="info-row">
                <span class="label">ডেলিভারি চার্জ:</span>
                <span class="value">৳${createdOrder.deliveryCharge !== undefined ? createdOrder.deliveryCharge : (createdOrder.totalAmount - createdOrder.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) - (createdOrder.discountAmount || 0))}</span>
              </div>
              <div class="total">Total: ৳${createdOrder.totalAmount}</div>
            </div>
          </div>

          <div class="section">
            <h2>Payment Information</h2>
            <div class="info-row">
              <span class="label">Payment Method:</span>
              <span class="value">${createdOrder.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="label">Payment Status:</span>
              <span class="value">${createdOrder.paymentStatus}</span>
            </div>
          </div>

          ${createdOrder.notes ? `
          <div class="section">
            <h2>Order Notes</h2>
            <p>${createdOrder.notes}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your order!</p>
            <p>For any queries, please contact us</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('আপনার কার্ট খালি!');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য প্রদান করুন।');
      return;
    }

    // Create order via API
    toast.loading('অর্ডার প্রসেস করা হচ্ছে...', { id: 'order-loading' });
    
    try {
      const orderData = {
        userId: customer?.id || 'guest',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: '', // Optional
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          name_en: item.name, // Using same name for now
          price: item.price,
          quantity: item.quantity,
          image: item.image || '' // Handle empty images
        })),
        totalAmount: total,
        deliveryCharge: shipping,
        discountAmount: discount,
        couponCode: appliedCoupon?.code || '',
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.city, // Using city as state for simplicity
          zipCode: '0000', // Default value
          country: 'Bangladesh'
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        notes: formData.notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        let errorData: any = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Failed to parse error as JSON:', errorText);
        }
        console.error('Parsed error data:', errorData);
        throw new Error(errorData.error || errorData.details || errorText || 'Failed to create order');
      }

      const result = await response.json();
      
      toast.dismiss('order-loading');
      setIsOrdered(true);
      setCreatedOrder(result);
      clearCart();
      toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
      window.scrollTo(0, 0);
    } catch (error) {
      toast.dismiss('order-loading');
      console.error('Error creating order:', error);
      toast.error('অর্ডার তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

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

  if (cart.length === 0 && !isOrdered) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <Header />
        <section className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
           <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-brand-green">
              <ShoppingBag size={64} />
           </div>
           <h1 className="text-4xl font-black text-brand-green-dark italic tracking-tight">চেকআউট করার জন্য কোনো পণ্য নেই!</h1>
           <Link href="/shop" className="inline-flex items-center gap-3 bg-brand-green text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all">
              <ArrowLeft size={20} /> কেনাকাটা করুন
           </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfdfa]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-4xl md:text-6xl font-black text-brand-green-dark italic tracking-tighter">চেকআউট</h1>
              <p className="text-slate-400 font-bold italic mt-2">অর্ডারটি সম্পন্ন করতে আপনার তথ্য প্রদান করুন</p>
           </div>
           <Link href="/cart" className="flex items-center gap-2 text-brand-green font-black italic hover:underline">
              <ArrowLeft size={18} /> কার্টে ফিরে যান
           </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
           
           {/* Checkout Form */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[3rem] border border-emerald-50 shadow-sm p-8 md:p-12 space-y-10">
                 
                 {/* Billing Section */}
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                          <User size={20} />
                       </div>
                       <h3 className="text-2xl font-black text-brand-green-dark italic">শিপিং তথ্য</h3>
                    </div>

                    <div className="grid gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">আপনার নাম *</label>
                          <input 
                            required
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="পুরো নাম লিখুন" 
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">মোবাইল নম্বর *</label>
                          <div className="relative">
                             <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                             <input 
                               required
                               type="tel" 
                               name="phone"
                               value={formData.phone}
                               onChange={handleInputChange}
                               placeholder="০১XXXXXXXXX" 
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ঠিকানা (ফুল এড্রেস) *</label>
                          <div className="relative">
                             <MapPin size={18} className="absolute left-6 top-6 text-slate-300" />
                             <textarea 
                               required
                               name="address"
                               value={formData.address}
                               onChange={handleInputChange}
                               rows={3}
                               placeholder="আপনার বিস্তারিত ঠিকানা লিখুন" 
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-14 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold resize-none"
                             />
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">শহর</label>
                             <select
                               name="city"
                               value={formData.city}
                               onChange={handleInputChange}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all font-bold appearance-none"
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
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">অর্ডার নোট (ঐচ্ছিক)</label>
                             <input
                               type="text"
                               name="notes"
                               value={formData.notes}
                               onChange={handleInputChange}
                               placeholder="বিশেষ কোনো অনুরোধ থাকলে"
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-bold"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Payment Section */}
                 <div className="space-y-8 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white">
                          <CreditCard size={20} />
                       </div>
                       <h3 className="text-2xl font-black text-brand-green-dark italic">পেমেন্ট পদ্ধতি</h3>
                    </div>

                    <div className="space-y-4">
                       <label className="relative flex items-center gap-4 p-6 bg-emerald-50 rounded-3xl border-2 border-brand-green cursor-pointer">
                          <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-brand-green" />
                          <div className="flex-1">
                             <p className="font-black text-brand-green-dark italic">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
                             <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">পণ্য হাতে পেয়ে টাকা দিন</p>
                          </div>
                          <Package className="text-brand-green" />
                       </label>
                       <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 text-amber-700 italic text-sm">
                          <CheckCircle2 size={18} className="shrink-0" />
                          <p>অনলাইন পেমেন্ট বর্তমানে সাময়িকভাবে বন্ধ আছে। দয়া করে ক্যাশ অন ডেলিভারি সিলেক্ট করুন।</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Order Summary */}
           <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="bg-brand-green-dark text-white rounded-[3.5rem] p-10 md:p-12 space-y-10 shadow-2xl shadow-brand-green/20">
                 <div className="flex justify-between items-end">
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black italic tracking-tighter">আপনার অর্ডার</h2>
                       <div className="w-12 h-1 bg-emerald-400 rounded-full" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{totalItems} আইটেম</span>
                 </div>

                 <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.variant}`} className="flex gap-4 group">
                         <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0 bg-white/5">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white/10">
                                <Package size={24} className="text-white/30" />
                              </div>
                            )}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-black text-white italic truncate">{item.name}</h4>
                            {item.variant && (
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{item.variant}</p>
                            )}
                            <p className="text-[10px] font-bold text-emerald-100/40 uppercase tracking-widest">{item.quantity} × ৳{item.price}</p>
                         </div>
                         <div className="font-black text-emerald-400 italic">৳{item.price * item.quantity}</div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6 pt-6 border-t border-white/10">
                    {/* Coupon Section */}
                    <div className="space-y-3">
                       {!appliedCoupon ? (
                          <div className="flex gap-2">
                             <input
                               type="text"
                               value={couponCode}
                               onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                               placeholder="কুপন কোড লিখুন"
                               className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-400 outline-none transition-all font-bold"
                             />
                             <button
                               type="button"
                               onClick={handleApplyCoupon}
                               disabled={validatingCoupon}
                               className="bg-emerald-400 text-brand-green-dark px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-300 transition-all disabled:opacity-50"
                             >
                               {validatingCoupon ? '...' : 'প্রয়োগ'}
                             </button>
                          </div>
                       ) : (
                          <div className="bg-emerald-400/20 border border-emerald-400/50 rounded-2xl p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Tag size={18} className="text-emerald-400" />
                                <div>
                                  <p className="font-black text-emerald-400 text-sm">{appliedCoupon.code}</p>
                                  <p className="text-xs text-emerald-200">
                                    {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `৳${appliedCoupon.discountValue}`} ছাড়
                                  </p>
                                </div>
                             </div>
                             <button
                               type="button"
                               onClick={handleRemoveCoupon}
                               className="text-emerald-400 hover:text-emerald-300 transition-colors"
                             >
                                <X size={18} />
                             </button>
                          </div>
                       )}
                    </div>

                    <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                       <span>সাব-টোটাল</span>
                       <span className="font-black text-white">৳{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 italic font-medium">
                         <span>ছাড়</span>
                         <span className="font-black">-৳{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-emerald-50/70 italic font-medium">
                       <span>ডেলিভারি চার্জ</span>
                       <span className="font-black text-white">{shipping === 0 ? 'ফ্রি' : `৳${shipping}`}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2">
                         <Truck size={14} className="text-emerald-400" />
                         <p className="text-[9px] text-emerald-100 font-black italic">ফ্রি ডেলিভারি প্রযোজ্য হয়েছে!</p>
                      </div>
                    )}
                    {shipping > 0 && subtotal < freeShippingThreshold && (
                      <div className="bg-white/5 p-3 rounded-2xl flex items-center gap-2">
                         <Truck size={14} className="text-emerald-400" />
                         <p className="text-[9px] text-emerald-100 font-black italic">
                           ৳{freeShippingThreshold - subtotal} এর ওপর অর্ডার করলে ফ্রি ডেলিভারি!
                         </p>
                      </div>
                    )}
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                       <div className="space-y-1">
                         <span className="text-sm font-black text-emerald-400 uppercase tracking-widest block">সর্বমোট</span>
                         <span className="text-5xl font-black tracking-tighter italic">৳{total}</span>
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full bg-white text-brand-green-dark py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl shadow-black/20"
                 >
                    অর্ডার করুন <CheckCircle2 size={24} />
                 </button>
                 
                 <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 opacity-40">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest leading-tight">নিরাপদ শপিং</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Truck size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest leading-tight">সারা দেশে ডেলিভারি</span>
                    </div>
                 </div>
              </div>
           </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
