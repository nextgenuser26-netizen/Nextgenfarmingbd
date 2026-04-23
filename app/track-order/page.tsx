'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [result, setResult] = useState<null | 'found' | 'not-found'>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;
    
    setIsTracking(true);
    setResult(null);
    setOrderData(null);
    
    try {
      const response = await fetch(`/api/orders?customerPhone=${phone}`);
      const data = await response.json();
      
      if (response.ok) {
        const orders = data.orders || [];
        const foundOrder = orders.find((order: any) => 
          order.orderNumber?.toLowerCase() === orderId.toLowerCase() || 
          order._id.toString() === orderId
        );
        
        if (foundOrder) {
          setOrderData(foundOrder);
          setResult('found');
        } else {
          setResult('not-found');
        }
      } else {
        setResult('not-found');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setResult('not-found');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-brand-green-dark py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-white/10 px-6 py-2 rounded-full text-xs font-black text-emerald-300 uppercase tracking-widest mb-6"
          >
            Real-time Tracking
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight"
          >
            অর্ডার <span className="text-emerald-300">ট্র্যাক করুন</span>
          </motion.h1>
          <p className="text-emerald-50/70 text-lg italic font-medium max-w-xl mx-auto">
            আপনার অর্ডারটি এখন কোথায় আছে এবং কখন ডেলিভারি হবে তা সহজেই জেনে নিন।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-5xl mx-auto px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-emerald-50 overflow-hidden">
           <div className="p-8 md:p-12">
              <form onSubmit={handleTrack} className="grid md:grid-cols-3 gap-6 items-end">
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">অর্ডার নম্বর (Order ID)</label>
                    <div className="relative">
                       <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="text" 
                         value={orderId}
                         onChange={(e) => setOrderId(e.target.value)}
                         placeholder="যেমন: ORD-12345"
                         className="w-full bg-[#f9fafb] border-2 border-transparent focus:border-brand-green outline-none py-4 pl-12 pr-6 rounded-2xl text-sm font-bold transition-all"
                         required
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="tel" 
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         placeholder="যেমন: ০১৯XXXXXXXX"
                         className="w-full bg-[#f9fafb] border-2 border-transparent focus:border-brand-green outline-none py-4 pl-12 pr-6 rounded-2xl text-sm font-bold transition-all"
                         required
                       />
                    </div>
                 </div>
                 <button 
                   type="submit"
                   disabled={isTracking}
                   className="bg-brand-green text-white py-4 rounded-2xl font-black italic flex items-center justify-center gap-3 shadow-xl shadow-brand-green/20 hover:bg-brand-green-dark transition-all disabled:opacity-50"
                 >
                    {isTracking ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search size={18} />
                        সার্চ করুন
                      </>
                    )}
                 </button>
              </form>
           </div>

           <AnimatePresence mode="wait">
              {result === 'found' && orderData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-emerald-50/30 border-t border-emerald-50 p-8 md:p-12 space-y-12"
                >
                   {/* Status Header */}
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm">
                            <Truck size={32} className="animate-bounce" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-brand-green-dark italic">অর্ডার {orderData.status}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Order ID: {orderData.orderNumber || orderData._id}</p>
                         </div>
                      </div>
                      <div className="text-center md:text-right">
                         <p className="text-slate-500 text-sm font-bold italic">অর্ডার ডেট</p>
                         <h4 className="text-xl font-black text-brand-green underline underline-offset-4 decoration-brand-green/20">{new Date(orderData.createdAt).toLocaleDateString('bn-BD')}</h4>
                      </div>
                   </div>

                   {/* Progress Tracker */}
                   <div className="relative pt-10 pb-4">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                      
                      <div className="relative z-10 flex justify-between">
                         {[
                           { icon: Clock, label: 'পেন্ডিং', status: 'pending' },
                           { icon: Package, label: 'কনফার্মড', status: 'confirmed' },
                           { icon: Package, label: 'প্রসেসিং', status: 'processing' },
                           { icon: Truck, label: 'শিপড্', status: 'shipped' },
                           { icon: CheckCircle2, label: 'ডেলিভার্ড', status: 'delivered' },
                         ].map((step, i) => {
                           const stepIndex = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(step.status);
                           const currentIndex = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(orderData.status);
                           const stepStatus = stepIndex <= currentIndex ? 'completed' : 'pending';
                           const isCurrent = stepIndex === currentIndex;
                           
                           return (
                             <div key={i} className="flex flex-col items-center gap-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                stepStatus === 'completed' ? 'bg-brand-green text-white' : 
                                isCurrent ? 'bg-white text-brand-green border-2 border-brand-green animate-pulse scale-110' : 
                                'bg-white text-slate-300'
                              }`}>
                                 <step.icon size={20} />
                              </div>
                              <span className={`text-[10px] md:text-xs font-black italic uppercase tracking-widest ${
                                stepStatus === 'pending' ? 'text-slate-300' : 'text-brand-green-dark'
                              }`}>{step.label}</span>
                           </div>
                           );
                         })}
                      </div>
                   </div>

                   {/* Details Grid */}
                   <div className="grid md:grid-cols-2 gap-8 pt-8">
                      <div className="bg-white p-6 rounded-3xl border border-emerald-50">
                         <div className="flex items-center gap-3 mb-4 text-brand-green">
                            <MapPin size={18} />
                            <h4 className="font-black italic">ডেলিভারি এড্রেস</h4>
                         </div>
                         <p className="text-slate-600 text-sm font-medium italic">
                            {orderData.shippingAddress?.street}, {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state}, {orderData.shippingAddress?.zipCode}
                         </p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-emerald-50">
                         <div className="flex items-center gap-10 mb-4 h-full">
                            <div>
                               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">পেমেন্ট মেথড</p>
                               <p className="text-brand-green-dark font-black italic">{orderData.paymentMethod}</p>
                            </div>
                            <div>
                               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">মোট টাকা</p>
                               <p className="text-brand-green-dark font-black italic">৳{orderData.totalAmount}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Order Items */}
                   <div className="bg-white p-6 rounded-3xl border border-emerald-50">
                      <h4 className="font-black italic text-brand-green mb-4">অর্ডার আইটেমসমূহ</h4>
                      <div className="space-y-3">
                         {orderData.items?.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-emerald-50 last:border-none">
                               <div className="flex items-center gap-3">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                      <Package size={16} className="text-gray-400" />
                                    </div>
                                  )}
                                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                               </div>
                               <div className="text-right">
                                  <p className="text-sm font-bold text-brand-green">৳{item.price} × {item.quantity}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {result === 'not-found' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-12 text-center bg-brand-red/5 border-t border-brand-red/10"
                >
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-red mx-auto shadow-sm mb-6">
                      <AlertCircle size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-brand-red italic mb-2">অর্ডারটি পাওয়া যায়নি!</h3>
                   <p className="text-slate-500 italic max-w-sm mx-auto">দয়া করে অর্ডার নম্বর এবং ফোন নম্বরটি পুনরায় চেক করুন অথবা কাস্টমার কেয়ারে যোগাযোগ করুন।</p>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </section>

      {/* FAQ Banner */}
      <section className="pb-20 max-w-5xl mx-auto px-8">
         <div className="bg-brand-green-dark rounded-[3rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
            <div className="relative z-10">
               <h3 className="text-2xl font-black text-white italic mb-2">ট্র্যাকিং নিয়ে কোনো সমস্যা?</h3>
               <p className="text-emerald-50/70 text-sm font-medium italic">সরাসরি আমাদের সাপোর্ট টিমের সাথে কথা বলুন।</p>
            </div>
            <div className="relative z-10 flex gap-4">
               <Link href="/contact" className="bg-white text-brand-green-dark px-8 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-xl">
                  কল দিন
               </Link>
               <Link href="/contact" className="bg-transparent border-2 border-white/20 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">
                  ইমেইল করুন
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
