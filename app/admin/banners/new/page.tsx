'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewBanner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    image: '',
    mobileImage: '',
    link: '',
    position: 'home' as 'home' | 'category' | 'product' | 'all' | 'hero-carousel' | 'featured-collections',
    order: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP images are allowed');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP images are allowed');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setMobileImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setMobileImagePreview(reader.result as string);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      let mobileImageUrl = formData.mobileImage;
      
      // Upload desktop image if file is selected
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
          setFormData({ ...formData, image: imageUrl });
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      // Upload mobile image if file is selected
      if (mobileImageFile) {
        setUploading(true);
        try {
          mobileImageUrl = await uploadImage(mobileImageFile);
          setFormData({ ...formData, mobileImage: mobileImageUrl });
        } catch (error) {
          console.error('Error uploading mobile image:', error);
          alert('Failed to upload mobile image');
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          mobileImage: mobileImageUrl,
          order: formData.order ? parseInt(formData.order) : undefined,
          startDate: formData.startDate ? new Date(formData.startDate) : undefined,
          endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin/banners');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/banners"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Banners
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Banner</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Bangla) {formData.position !== 'hero-carousel' && '*'}
              </label>
              <input
                type="text"
                required={formData.position !== 'hero-carousel'}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                placeholder={formData.position === 'hero-carousel' ? 'Optional for carousel' : ''}
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
                placeholder={formData.position === 'hero-carousel' ? 'Optional for carousel' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position *
              </label>
              <select
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              >
                <option value="home">Home (General)</option>
                <option value="hero-carousel">Hero - Left Carousel</option>
                <option value="featured-collections">Featured Collections</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
                <option value="all">All Pages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                placeholder="Display order (lower number shows first)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Banner Image (Desktop) *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Recommended size: 1920x288px (16:9 aspect ratio). Max file size: 5MB.
              </p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Desktop Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Desktop Preview"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Banner Image (Mobile)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Recommended size: 768x160px (for mobile screens). Max file size: 5MB.
              </p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleMobileImageChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {mobileImagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Mobile Preview:</p>
                  <img
                    src={mobileImagePreview}
                    alt="Mobile Preview"
                    className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                placeholder="https://example.com/page"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Bangla) {formData.position !== 'hero-carousel' && '*'}
            </label>
            <textarea
              rows={3}
              required={formData.position !== 'hero-carousel'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              placeholder={formData.position === 'hero-carousel' ? 'Optional for carousel' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (English)
            </label>
            <textarea
              rows={3}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              placeholder={formData.position === 'hero-carousel' ? 'Optional for carousel' : ''}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-700 rounded focus:ring-green-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/banners"
              className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#6BCB8F' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5AB87E')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
            >
              <Save className="w-5 h-5 mr-2" />
              {uploading ? 'Uploading Image...' : loading ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
