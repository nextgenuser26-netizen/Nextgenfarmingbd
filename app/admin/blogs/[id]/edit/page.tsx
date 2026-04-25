'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditBlog() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    slug: '',
    content: '',
    content_en: '',
    excerpt: '',
    excerpt_en: '',
    featuredImage: '',
    author: '',
    tags: '',
    category: '',
    status: 'draft',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  useEffect(() => {
    fetchBlog();
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs`);
      const data = await res.json();
      const blog = data.blogs?.find((b: any) => b._id === params.id);
      if (blog) {
        setFormData({
          title: blog.title || '',
          title_en: blog.title_en || '',
          slug: blog.slug || '',
          content: blog.content || '',
          content_en: blog.content_en || '',
          excerpt: blog.excerpt || '',
          excerpt_en: blog.excerpt_en || '',
          featuredImage: blog.featuredImage || '',
          author: blog.author || '',
          tags: blog.tags?.join(', ') || '',
          category: blog.category || '',
          status: blog.status || 'draft',
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || '',
          metaKeywords: blog.metaKeywords || '',
          ogImage: blog.ogImage || '',
        });
        // Set image preview if featured image exists
        if (blog.featuredImage) {
          setImagePreview(blog.featuredImage);
        }
        // Set OG image preview if exists
        if (blog.ogImage) {
          setOgImagePreview(blog.ogImage);
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  };

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
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setOgImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setOgImagePreview(reader.result as string);
      };
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
    // Handle both single file (url) and multiple files (urls array) responses
    return data.url || (data.urls && data.urls[0]) || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let featuredImageUrl = formData.featuredImage;
      let ogImageUrl = formData.ogImage;
      
      // Upload featured image if a file is selected
      if (imageFile) {
        setUploading(true);
        try {
          featuredImageUrl = await uploadImage(imageFile);
          setFormData({ ...formData, featuredImage: featuredImageUrl });
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }

      // Upload OG image if a file is selected
      if (ogImageFile) {
        setUploading(true);
        try {
          ogImageUrl = await uploadImage(ogImageFile);
          setFormData({ ...formData, ogImage: ogImageUrl });
        } catch (error) {
          console.error('Error uploading OG image:', error);
          alert('Failed to upload OG image');
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }

      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          featuredImage: featuredImageUrl,
          ogImage: ogImageUrl,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        }),
      });

      if (res.ok) {
        router.push('/admin/blogs');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Failed to update blog post');
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
          href="/admin/blogs"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blogs
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
                placeholder="blog-post-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt (Bangla)
            </label>
            <textarea
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt (English)
            </label>
            <textarea
              rows={3}
              value={formData.excerpt_en}
              onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content (Bangla) *
            </label>
            <textarea
              rows={10}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content (English)
            </label>
            <textarea
              rows={10}
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-white mb-4">SEO Settings</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  placeholder="Leave empty to use blog title"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Recommended: 50-60 characters. Current: {formData.metaTitle.length}/60
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Comma-separated keywords for search engines
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                  placeholder="Leave empty to use excerpt"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Recommended: 150-160 characters. Current: {formData.metaDescription.length}/160
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OG Image (Open Graph Image for Social Media)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleOgImageChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Recommended size: 1200x630px. Leave empty to use featured image.
                </p>
                {ogImagePreview && (
                  <div className="mt-2">
                    <img
                      src={ogImagePreview}
                      alt="OG Image Preview"
                      className="w-64 h-32 object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/blogs"
              className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
