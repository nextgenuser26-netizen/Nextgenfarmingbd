'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(searchParams.get('mode') === 'register');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear any existing customer data on login page load
    localStorage.removeItem('customer');
    localStorage.removeItem('user');
  }, []);

  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 11) {
      toast.error('অনুগ্রহ করে সঠিক ফোন নম্বর প্রদান করুন');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/customer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log('[checkPhone] API response:', { status: response.status, ok: response.ok, data });

      if (response.ok) {
        // Store user in localStorage for both customer and auth contexts
        localStorage.setItem('customer', JSON.stringify(data));
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('লগইন সফলভাবে সম্পন্ন হয়েছে!');
        router.push('/customer-dashboard');
      } else if (response.status === 400 && data.error === 'Name is required for new users') {
        setIsNewUser(true);
        toast('নতুন ব্যবহারকারী চিহ্নিত হয়েছে। আপনার নাম প্রদান করুন।');
      } else {
        console.error('[checkPhone] API error:', data);
        toast.error(data.error || 'লগইন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error checking phone:', error);
      toast.error('সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      toast.error('সব তথ্য প্রদান করুন');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/customer-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, name }),
      });

      const rawText = await response.text();
      console.log('[register] Raw response text:', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error('[register] Failed to parse JSON:', e);
        data = { rawText };
      }

      console.log('[register] Parsed API response:', { status: response.status, ok: response.ok, data });

      if (response.ok) {
        localStorage.setItem('customer', JSON.stringify(data));
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('অ্যাকাউন্ট তৈরি সফলভাবে সম্পন্ন হয়েছে!');
        router.push('/customer-dashboard');
      } else {
        console.error('[register] API error:', data);
        toast.error(data.error || 'নিবন্ধন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 shadow-xl border border-emerald-50"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 italic mb-2">
                {isNewUser ? 'অ্যাকাউন্ট তৈরি করুন' : 'কাস্টমার লগইন'}
              </h1>
              <p className="text-gray-500 font-medium italic">
                {isNewUser ? 'আপনার তথ্য প্রদান করে অ্যাকাউন্ট তৈরি করুন' : 'আপনার ফোন নম্বর দিয়ে লগইন করুন'}
              </p>
            </div>

            {/* Login / Register Tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                type="button"
                onClick={() => { setIsNewUser(false); setName(''); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  !isNewUser
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                লগইন
              </button>
              <button
                type="button"
                onClick={() => setIsNewUser(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  isNewUser
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                নতুন অ্যাকাউন্ট
              </button>
            </div>

            {!isNewUser ? (
              <form onSubmit={handleCheckPhone} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ফোন নম্বর</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black italic text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : 'লগইন করুন'}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">আপনার নাম</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ফোন নম্বর</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-lg"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black italic text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
                  {!loading && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link href="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                হোম পেজে যান
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CustomerLoginForm />
    </Suspense>
  );
}
