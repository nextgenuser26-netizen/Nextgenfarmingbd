'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditSEO() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    pagePath: '',
    pageName: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    robots: 'index, follow',
    structuredData: '',
    customHeadTags: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSEO();
  }, [params.id]);

  const fetchSEO = async () => {
    try {
      const res = await fetch(`/api/seo/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      } else {
        alert('Failed to load SEO configuration');
        router.push('/admin/seo');
      }
    } catch (error) {
      console.error('Error fetching SEO:', error);
      alert('Failed to load SEO configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/seo/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/seo');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update SEO configuration');
      }
    } catch (error) {
      console.error('Error updating SEO:', error);
      alert('Failed to update SEO configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          href="/admin/seo"
          className="flex items-center text-gray-400 hover:text-white mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit SEO Configuration</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Name *
              </label>
              <input
                type="text"
                name="pageName"
                value={formData.pageName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Home Page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Path *
              </label>
              <input
                type="text"
                name="pagePath"
                value={formData.pagePath}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., /"
              />
              <p className="text-xs text-gray-500 mt-1">The URL path for this page (e.g., /, /about, /products)</p>
            </div>
          </div>
        </div>

        {/* Meta Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Meta Tags</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title *
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                required
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Nextgenfarmingbd - Natural and Pure Food"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters. Current: {formData.metaTitle.length}/60</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description *
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                required
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Discover the best quality natural and pure food products across Bangladesh"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters. Current: {formData.metaDescription.length}/160</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., organic food, natural products, Bangladesh"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
            </div>
          </div>
        </div>

        {/* Open Graph Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Open Graph Tags (Social Media)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Title
              </label>
              <input
                type="text"
                name="ogTitle"
                value={formData.ogTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Leave empty to use Meta Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Description
              </label>
              <textarea
                name="ogDescription"
                value={formData.ogDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Leave empty to use Meta Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Image URL
              </label>
              <input
                type="text"
                name="ogImage"
                value={formData.ogImage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter Card Type
              </label>
              <select
                name="twitterCard"
                value={formData.twitterCard}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/page"
              />
              <p className="text-xs text-gray-500 mt-1">Prevent duplicate content issues</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Robots Meta Tag
              </label>
              <input
                type="text"
                name="robots"
                value={formData.robots}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="index, follow"
              />
              <p className="text-xs text-gray-500 mt-1">e.g., index, follow, noindex, nofollow</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Structured Data (JSON-LD)
              </label>
              <textarea
                name="structuredData"
                value={formData.structuredData}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder='{"@context": "https://schema.org", "@type": "WebSite", ...}'
              />
              <p className="text-xs text-gray-500 mt-1">JSON-LD structured data for schema.org</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Head Tags
              </label>
              <textarea
                name="customHeadTags"
                value={formData.customHeadTags}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder='{"@context": "https://schema.org", "@type": "WebSite", ...}'
              />
              <p className="text-xs text-gray-500 mt-1">Additional custom meta tags or scripts</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/seo"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#6BCB8F' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#5AB87E')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Update SEO Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
