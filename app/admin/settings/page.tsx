'use client';

import { useEffect, useState } from 'react';
import { Save, Upload, Image as ImageIcon, Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, CircleDollarSign, Truck, Shield, Search, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      console.log('Fetched settings data:', data);
      console.log('Banner image from fetch:', data.settings?.bannerImage);
      setSettings(data.settings);
      if (data.settings?.logo) setLogoPreview(data.settings.logo);
      if (data.settings?.favicon) setFaviconPreview(data.settings.favicon);
      if (data.settings?.bannerImage) setBannerPreview(data.settings.bannerImage);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'favicon' | 'banner') => {
    try {
      console.log('Uploading image:', file.name, 'Type:', type);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Upload response:', data);
      
      if (!res.ok) {
        console.error('Upload failed:', data.error);
        alert(`Upload failed: ${data.error}`);
        return;
      }
      
      if (data.urls && data.urls.length > 0) {
        const uploadedUrl = data.urls[0];
        console.log('Uploaded URL:', uploadedUrl);
        
        if (type === 'logo') {
          setSettings({ ...settings, logo: uploadedUrl });
          setLogoPreview(uploadedUrl);
        } else if (type === 'favicon') {
          setSettings({ ...settings, favicon: uploadedUrl });
          setFaviconPreview(uploadedUrl);
        } else if (type === 'banner') {
          setSettings({ ...settings, bannerImage: uploadedUrl });
          setBannerPreview(uploadedUrl);
          console.log('Banner image set in state:', uploadedUrl);
        }
      } else {
        console.error('No URLs in response:', data);
        alert('Upload failed: No URL returned');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Saving settings:', settings);
      console.log('Banner image in settings:', settings?.bannerImage);
      
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
        console.log('Settings saved successfully');
      } else {
        alert('Failed to save settings');
        console.error('Failed to save settings, response:', await res.text());
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-300 mt-1">Manage your site configuration and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name (Bangla) *
              </label>
              <input
                type="text"
                value={settings?.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="NextGen FarmingBD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name (English)
              </label>
              <input
                type="text"
                value={settings?.siteNameEn || ''}
                onChange={(e) => setSettings({ ...settings, siteNameEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="NextGen FarmingBD"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description (Bangla)
              </label>
              <textarea
                rows={3}
                value={settings?.siteDescription || ''}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="সেরা মানের খাঁটি পণ্যের জন্য আপনার বিশ্বস্ত গন্তব্য"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description (English)
              </label>
              <textarea
                rows={3}
                value={settings?.siteDescriptionEn || ''}
                onChange={(e) => setSettings({ ...settings, siteDescriptionEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your trusted destination for premium quality authentic products"
              />
            </div>
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Logo & Favicon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="space-y-2">
                {logoPreview && (
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'logo');
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div className="space-y-2">
                {faviconPreview && (
                  <div className="relative w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                    <img src={faviconPreview} alt="Favicon preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'favicon');
                    }}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Favicon
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Home Page Banner Image
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <p className="text-sm text-gray-500 mb-4">
              This image will be displayed in the "অর্গানিক ফুড নিয়ে চিন্তিত?" section on the home page.
            </p>
            <div className="space-y-4">
              {bannerPreview && (
                <div className="relative w-full max-w-md h-48 border border-gray-300 rounded-lg overflow-hidden">
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                  <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                    Banner image uploaded (will be saved when you click Save Settings)
                  </p>
                </div>
              )}
              {!bannerPreview && (
                <div className="w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <p className="text-gray-400 text-sm">No banner image uploaded</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    console.log('File selected:', file);
                    if (file) {
                      console.log('File details:', file.name, file.size, file.type);
                      handleImageUpload(file, 'banner');
                    }
                  }}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Banner Image
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={settings?.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="info@nextgenfarmingbd.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="text"
                value={settings?.contactPhone || ''}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+8801XXXXXXXXX"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Address
              </label>
              <textarea
                rows={3}
                value={settings?.contactAddress || ''}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your business address"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Facebook className="w-5 h-5" />
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook URL
              </label>
              <input
                type="url"
                value={settings?.socialFacebook || ''}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram URL
              </label>
              <input
                type="url"
                value={settings?.socialInstagram || ''}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter URL
              </label>
              <input
                type="url"
                value={settings?.socialTwitter || ''}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://twitter.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube URL
              </label>
              <input
                type="url"
                value={settings?.socialYoutube || ''}
                onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
        </div>

        {/* Currency & Shipping */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5" />
            Currency & Shipping
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Code *
              </label>
              <input
                type="text"
                value={settings?.currency || ''}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="BDT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Symbol *
              </label>
              <input
                type="text"
                value={settings?.currencySymbol || ''}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="৳"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.taxRate || 0}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost (Inside Dhaka)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.shippingCostInsideDhaka || 0}
                onChange={(e) => setSettings({ ...settings, shippingCostInsideDhaka: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost (Outside Dhaka)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.shippingCostOutsideDhaka || 0}
                onChange={(e) => setSettings({ ...settings, shippingCostOutsideDhaka: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="150"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold
              </label>
              <input
                type="number"
                step="0.01"
                value={settings?.freeShippingThreshold || 0}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1500"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Settings
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={settings?.seoTitle || ''}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="NextGen FarmingBD - Premium Quality Products"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                rows={3}
                value={settings?.seoDescription || ''}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Meta description for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                type="text"
                value={settings?.seoKeywords || ''}
                onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="organic, farming, honey, ghee, bangladesh"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Maintenance Mode
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enable Maintenance Mode
                </label>
                <p className="text-sm text-gray-500">
                  Temporarily disable your site for maintenance
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings?.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  settings?.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                }`}
                aria-pressed={settings?.maintenanceMode}
              >
                <span className="sr-only">Toggle maintenance mode</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                    settings?.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings?.maintenanceMode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Maintenance mode is currently active. Non-admin users will see the maintenance page.
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Message
              </label>
              <textarea
                rows={3}
                value={settings?.maintenanceMessage || ''}
                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="We are currently under maintenance. Please check back later."
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be displayed to users when maintenance mode is active.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6BCB8F' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#5AB87E')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
