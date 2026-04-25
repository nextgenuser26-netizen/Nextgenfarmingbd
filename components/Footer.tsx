import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
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

  return (
    <footer className="bg-brand-green-dark text-white pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || 'Logo'}
                  className="w-10 h-10 object-contain rounded-[22px]"
                />
              ) : (
                <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white">
                  <div className="w-6 h-6 border-2 border-white rounded-sm transform rotate-45"></div>
                </div>
              )}
              <span className="text-2xl font-bold text-white tracking-tight italic">
                {settings?.siteName ? (
                  settings.siteName.split(/(Gen)/g).map((part: string, i: number) =>
                    part === 'Gen' || part === 'জেন' ? (
                      <span key={i} style={{ color: '#8B4513' }}>{part}</span>
                    ) : (
                      <span key={i} className="text-green-600">{part}</span>
                    )
                  )
                ) : (
                  <>
                    <span className="text-green-600">নেক্সট</span>
                    <span style={{ color: '#8B4513' }}>জেন</span>
                    <span className="text-green-600"> FarmingBD</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-emerald-50/70 text-sm leading-relaxed italic">
              {settings?.siteDescription || 'আমরা দিচ্ছি ১০০% খাঁটি পণ্য। আমাদের প্রতিটি পণ্য নিজস্ব তত্ত্বাবধানে তৈরি বা সরাসরি কৃষক থেকে সংগৃহীত। স্বাস্থ্যকর জীবনের জন্য আজই নেক্সটজেন FarmingBD বেছে নিন।'}
            </p>
            <div className="flex items-center gap-4">
              {settings?.socialFacebook && (
                <Link href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-colors border border-white/10">
                  <Facebook size={18} />
                </Link>
              )}
              {settings?.socialInstagram && (
                <Link href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-colors border border-white/10">
                  <Instagram size={18} />
                </Link>
              )}
              {settings?.socialYoutube && (
                <Link href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-colors border border-white/10">
                  <Youtube size={18} />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-200">গুরুত্বপূর্ণ লিঙ্ক</h3>
            <ul className="space-y-3 text-emerald-50/60 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">সকল পণ্য</Link></li>
              <li><Link href="/offers" className="hover:text-white transition-colors">অফার সমূহ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">যোগাযোগ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-200">কাস্টমার সার্ভিস</h3>
            <ul className="space-y-3 text-emerald-50/60 text-sm">
              <li><Link href="/track-order" className="hover:text-white transition-colors">অর্ডার ট্র্যাক করুন</Link></li>
              <li><Link href="/return" className="hover:text-white transition-colors">রিটার্ন পলিসি</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">শিপিং পলিসি</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">সাধারণ জিজ্ঞাসা</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-emerald-200">যোগাযোগ করুন</h3>
            <ul className="space-y-4 text-emerald-50/60 text-sm">
              {settings?.contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-white flex-shrink-0" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white flex-shrink-0" />
                <span>{settings?.contactPhone || '+৮৮০ ১৬১১-১৩৩৩৬৫'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white flex-shrink-0" />
                <span>{settings?.contactEmail || 'info@nextgenfarmingbd.com'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Micro Bottom Footer */}
      <div className="w-full bg-[#f0ede4] py-3 px-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 border-t border-slate-200 gap-4">
        <span>© ২০২৬ <span className="text-green-600">নেক্সট</span><span style={{ color: '#8B4513' }}>জেন</span><span className="text-green-600"> FarmingBD</span> - খাঁটি পণ্যের বিশ্বস্ত প্রতিষ্ঠান</span>
        <div className="flex gap-6 uppercase tracking-wider font-bold">
          <Link href="/terms" className="hover:text-brand-green">শর্তাবলী</Link>
          <Link href="/privacy" className="hover:text-brand-green">গোপনীয়তা নীতি</Link>
          <Link href="/refund" className="hover:text-brand-green">রিফান্ড পলিসি</Link>
        </div>
      </div>
    </footer>
  );
}
