'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export default function EditLandingPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    slug: '',
    productId: '',
    heroImage: '',
    heroTitle: '',
    heroTitle_en: '',
    heroSubtitle: '',
    heroSubtitle_en: '',
    heroCtaText: '',
    heroCtaText_en: '',
    heroCtaLink: '',
    contentSections: [{ title: '', title_en: '', description: '', description_en: '', image: '', order: 0 }],
    features: [{ icon: '', title: '', title_en: '', description: '', description_en: '' }],
    testimonials: [{ name: '', name_en: '', content: '', content_en: '', rating: 5, image: '' }],
    faq: [{ question: '', question_en: '', answer: '', answer_en: '' }],
    enableCheckout: false,
    checkoutTitle: '',
    checkoutTitle_en: '',
    checkoutSubtitle: '',
    checkoutSubtitle_en: '',
    customPrice: '',
    discountPrice: '',
    showQuantity: false,
    defaultQuantity: 1,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    fetchLandingPage();
  }, [params.id]);

  const fetchLandingPage = async () => {
    try {
      const res = await fetch(`/api/landing-pages?id=${params.id}`);
      if (!res.ok) {
        console.error('API response not OK:', res.status, res.statusText);
        throw new Error(`Failed to fetch landing page: ${res.status}`);
      }
      const data = await res.json();
      if (data.landingPage) {
        const page = data.landingPage;
        setFormData({
          title: page.title || '',
          title_en: page.title_en || '',
          slug: page.slug || '',
          productId: page.productId || '',
          heroImage: page.heroImage || '',
          heroTitle: page.heroTitle || '',
          heroTitle_en: page.heroTitle_en || '',
          heroSubtitle: page.heroSubtitle || '',
          heroSubtitle_en: page.heroSubtitle_en || '',
          heroCtaText: page.heroCtaText || '',
          heroCtaText_en: page.heroCtaText_en || '',
          heroCtaLink: page.heroCtaLink || '',
          contentSections: page.contentSections?.length ? page.contentSections : [{ title: '', title_en: '', description: '', description_en: '', image: '', order: 0 }],
          features: page.features?.length ? page.features : [{ icon: '', title: '', title_en: '', description: '', description_en: '' }],
          testimonials: page.testimonials?.length ? page.testimonials : [{ name: '', name_en: '', content: '', content_en: '', rating: 5, image: '' }],
          faq: page.faq?.length ? page.faq : [{ question: '', question_en: '', answer: '', answer_en: '' }],
          enableCheckout: page.enableCheckout || false,
          checkoutTitle: page.checkoutTitle || '',
          checkoutTitle_en: page.checkoutTitle_en || '',
          checkoutSubtitle: page.checkoutSubtitle || '',
          checkoutSubtitle_en: page.checkoutSubtitle_en || '',
          customPrice: page.customPrice?.toString() || '',
          discountPrice: page.discountPrice?.toString() || '',
          showQuantity: page.showQuantity || false,
          defaultQuantity: page.defaultQuantity || 1,
          seoTitle: page.seoTitle || '',
          seoDescription: page.seoDescription || '',
          seoKeywords: page.seoKeywords || '',
          status: page.status || 'draft',
        });
        if (page.heroImage) {
          setHeroImagePreview(page.heroImage);
        }
      }
    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setHeroImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await res.json();
    return data.url || (data.urls && data.urls[0]) || '';
  };

  const addContentSection = () => {
    setFormData({
      ...formData,
      contentSections: [
        ...formData.contentSections,
        { title: '', title_en: '', description: '', description_en: '', image: '', order: formData.contentSections.length }
      ]
    });
  };

  const removeContentSection = (index: number) => {
    setFormData({
      ...formData,
      contentSections: formData.contentSections.filter((_, i) => i !== index)
    });
  };

  const updateContentSection = (index: number, field: string, value: any) => {
    const updated = [...formData.contentSections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, contentSections: updated });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: '', title: '', title_en: '', description: '', description_en: '' }]
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, features: updated });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { name: '', name_en: '', content: '', content_en: '', rating: 5, image: '' }]
    });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index)
    });
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const updated = [...formData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, testimonials: updated });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faq: [...formData.faq, { question: '', question_en: '', answer: '', answer_en: '' }]
    });
  };

  const removeFaq = (index: number) => {
    setFormData({
      ...formData,
      faq: formData.faq.filter((_, i) => i !== index)
    });
  };

  const updateFaq = (index: number, field: string, value: any) => {
    const updated = [...formData.faq];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, faq: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let heroImageUrl = formData.heroImage;
      
      if (heroImageFile) {
        setUploading(true);
        try {
          heroImageUrl = await uploadImage(heroImageFile);
          setFormData({ ...formData, heroImage: heroImageUrl });
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }

      const res = await fetch(`/api/landing-pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          heroImage: heroImageUrl,
        }),
      });

      if (res.ok) {
        router.push('/admin/landing-pages');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update landing page');
      }
    } catch (error) {
      console.error('Error updating landing page:', error);
      alert('Failed to update landing page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/landing-pages"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Landing Pages
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Landing Page</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product ID (Optional)
              </label>
              <input
                type="text"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Hero Section */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hero Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {heroImagePreview && (
                  <div className="mt-2">
                    <img
                      src={heroImagePreview}
                      alt="Hero Preview"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Title (Bangla) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle_en}
                    onChange={(e) => setFormData({ ...formData, heroTitle_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Subtitle (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubtitle_en}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CTA Text (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.heroCtaText}
                    onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CTA Text (English)
                  </label>
                  <input
                    type="text"
                    value={formData.heroCtaText_en}
                    onChange={(e) => setFormData({ ...formData, heroCtaText_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CTA Link
                  </label>
                  <input
                    type="url"
                    value={formData.heroCtaLink}
                    onChange={(e) => setFormData({ ...formData, heroCtaLink: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Content Sections</h3>
              <button
                type="button"
                onClick={addContentSection}
                className="flex items-center px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Section
              </button>
            </div>
            <div className="space-y-4">
              {formData.contentSections.map((section, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Section {index + 1}</span>
                    {formData.contentSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title (Bangla) *
                      </label>
                      <input
                        type="text"
                        required
                        value={section.title}
                        onChange={(e) => updateContentSection(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={section.title_en}
                        onChange={(e) => updateContentSection(index, 'title_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (Bangla) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={section.description}
                        onChange={(e) => updateContentSection(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        rows={3}
                        value={section.description_en}
                        onChange={(e) => updateContentSection(index, 'description_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={section.image}
                        onChange={(e) => updateContentSection(index, 'image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={section.order}
                        onChange={(e) => updateContentSection(index, 'order', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Features</h3>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </button>
            </div>
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Feature {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Icon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title (Bangla) *
                      </label>
                      <input
                        type="text"
                        required
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={feature.title_en}
                        onChange={(e) => updateFeature(index, 'title_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (Bangla) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={feature.description_en}
                        onChange={(e) => updateFeature(index, 'description_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Testimonials</h3>
              <button
                type="button"
                onClick={addTestimonial}
                className="flex items-center px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Testimonial
              </button>
            </div>
            <div className="space-y-4">
              {formData.testimonials.map((testimonial, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Testimonial {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name (Bangla) *
                      </label>
                      <input
                        type="text"
                        required
                        value={testimonial.name}
                        onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={testimonial.name_en}
                        onChange={(e) => updateTestimonial(index, 'name_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content (Bangla) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={testimonial.content}
                        onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content (English)
                      </label>
                      <textarea
                        rows={3}
                        value={testimonial.content_en}
                        onChange={(e) => updateTestimonial(index, 'content_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating}
                        onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={testimonial.image}
                        onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">FAQ</h3>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {formData.faq.map((item, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">FAQ {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question (Bangla) *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Question (English)
                      </label>
                      <input
                        type="text"
                        value={item.question_en}
                        onChange={(e) => updateFaq(index, 'question_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Answer (Bangla) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={item.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Answer (English)
                      </label>
                      <textarea
                        rows={3}
                        value={item.answer_en}
                        onChange={(e) => updateFaq(index, 'answer_en', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Settings */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Checkout Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableCheckout"
                  checked={formData.enableCheckout}
                  onChange={(e) => setFormData({ ...formData, enableCheckout: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 focus:ring-2 focus:ring-green-500"
                />
                <label htmlFor="enableCheckout" className="text-sm font-medium text-gray-300">
                  Enable Direct Checkout on Landing Page
                </label>
              </div>
              
              {formData.enableCheckout && (
                <div className="space-y-4 pl-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Checkout Title (Bangla)
                      </label>
                      <input
                        type="text"
                        value={formData.checkoutTitle}
                        onChange={(e) => setFormData({ ...formData, checkoutTitle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="এখনই অর্ডার করুন"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Checkout Title (English)
                      </label>
                      <input
                        type="text"
                        value={formData.checkoutTitle_en}
                        onChange={(e) => setFormData({ ...formData, checkoutTitle_en: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="Order Now"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Checkout Subtitle (Bangla)
                      </label>
                      <input
                        type="text"
                        value={formData.checkoutSubtitle}
                        onChange={(e) => setFormData({ ...formData, checkoutSubtitle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="বিশেষ অফার সীমিত সময়ের জন্য"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Checkout Subtitle (English)
                      </label>
                      <input
                        type="text"
                        value={formData.checkoutSubtitle_en}
                        onChange={(e) => setFormData({ ...formData, checkoutSubtitle_en: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="Limited time special offer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Custom Price (leave empty to use product price)
                      </label>
                      <input
                        type="number"
                        value={formData.customPrice}
                        onChange={(e) => setFormData({ ...formData, customPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discount Price (optional)
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showQuantity"
                        checked={formData.showQuantity}
                        onChange={(e) => setFormData({ ...formData, showQuantity: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-700 focus:ring-2 focus:ring-green-500"
                      />
                      <label htmlFor="showQuantity" className="text-sm font-medium text-gray-300">
                        Show Quantity Selector
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.defaultQuantity}
                        onChange={(e) => setFormData({ ...formData, defaultQuantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/landing-pages"
              className="px-6 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#6BCB8F' }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#5AB87E')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
            >
              <Save className="w-5 h-5 mr-2" />
              {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
