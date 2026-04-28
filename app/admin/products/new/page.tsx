'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    price: '',
    oldPrice: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    galleryImages: [] as string[],
    mainImageIndex: 0,
    description: '',
    description_en: '',
    details: '',
    inStock: true,
    hasVariants: false,
    variants: [] as Array<{
      name: string;
      name_en: string;
      price: string;
      oldPrice: string;
      inStock: boolean;
    }>,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const selectedCategory = categories.find((cat: any) => cat.name_en === formData.category);

  const handleImageUpload = async (files: File[], type: 'main' | 'gallery') => {
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      // Upload each file individually
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', res.status);

        if (!res.ok) {
          const error = await res.json();
          console.error('Upload error:', error);
          throw new Error(error.error || 'Failed to upload image');
        }

        const data = await res.json();
        console.log('Upload response data:', data);
        if (data.urls && data.urls.length > 0) {
          uploadedUrls.push(...data.urls);
        }
      }

      if (type === 'main') {
        setFormData((prev) => ({ ...prev, images: uploadedUrls }));
        setImagePreviews(uploadedUrls);
      } else {
        // For gallery, append new URLs to existing ones
        setFormData((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...uploadedUrls] }));
        setGalleryImagePreviews(prev => [...prev, ...uploadedUrls]);
      }

      // Reset file input after successful upload
      if (type === 'gallery' && galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const files = Array.from(e.target.files || []);
    const maxFiles = type === 'main' ? 1 : 2;
    
    if (files.length > maxFiles) {
      alert(`Please select up to ${maxFiles} images only.`);
      return;
    }
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP files are allowed.');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
      }
    }

    if (type === 'main') {
      setImageFiles(files);
    } else {
      // For gallery, append new files to existing ones
      const currentCount = galleryImagePreviews.length;
      if (currentCount + files.length > maxFiles) {
        alert(`You can only have up to ${maxFiles} gallery images. Currently have ${currentCount}.`);
        return;
      }
      setGalleryImageFiles(prev => [...prev, ...files]);
    }

    // Create previews only for main images (gallery previews are added after upload)
    if (type === 'main') {
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Auto-upload the images
    handleImageUpload(files, type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) {
      alert('Please wait for images to finish uploading.');
      return;
    }

    if (formData.images.length === 0) {
      alert('Please upload at least one image for the product.');
      return;
    }

    if (formData.hasVariants && formData.variants.length === 0) {
      alert('Please add at least one variant.');
      return;
    }

    // Validate price when not using variants
    if (!formData.hasVariants && (!formData.price || parseFloat(formData.price) <= 0)) {
      alert('Please enter a valid price greater than 0.');
      return;
    }

    setLoading(true);

    console.log('Submitting product data:', formData);
    console.log('Has variants:', formData.hasVariants);
    console.log('Variants:', formData.variants);

    try {
      // Calculate price from variants if hasVariants is true
      let finalPrice = formData.hasVariants ? 0 : parseFloat(formData.price);
      let finalOldPrice = formData.hasVariants ? undefined : (formData.oldPrice ? parseFloat(formData.oldPrice) : undefined);

      if (formData.hasVariants && formData.variants.length > 0) {
        // Set main price to minimum variant price
        const variantPrices = formData.variants.map(v => parseFloat(v.price)).filter(p => p > 0);
        if (variantPrices.length > 0) {
          finalPrice = Math.min(...variantPrices);
        }

        // Set main old price to minimum variant old price if any variant has old price
        const variantOldPrices = formData.variants
          .map(v => v.oldPrice ? parseFloat(v.oldPrice) : null)
          .filter((p): p is number => p !== null && p > 0);
        if (variantOldPrices.length > 0) {
          finalOldPrice = Math.min(...variantOldPrices);
        }
      }

      const submitData = {
        ...formData,
        price: finalPrice,
        oldPrice: finalOldPrice,
        variants: formData.hasVariants ? formData.variants.map(v => ({
          ...v,
          price: parseFloat(v.price),
          oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : undefined
        })) : [],
      };

      console.log('Data being sent to API:', submitData);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { name: '', name_en: '', price: '', oldPrice: '', inStock: true }
      ]
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (৳) {!formData.hasVariants && '*'}
              </label>
              <input
                type="number"
                required={!formData.hasVariants}
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
              {formData.hasVariants && (
                <p className="text-xs text-gray-500 mt-1">This price is ignored when variants are enabled</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Old Price (৳) (optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
              {formData.hasVariants && (
                <p className="text-xs text-gray-500 mt-1">This price is ignored when variants are enabled</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat.name_en}>
                    {cat.icon} {cat.name} ({cat.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                disabled={!selectedCategory || !selectedCategory.subcategories || selectedCategory.subcategories.length === 0}
              >
                <option value="">Select a subcategory (optional)</option>
                {selectedCategory?.subcategories?.map((sub: string, index: number) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="hasVariants"
                checked={formData.hasVariants}
                onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-700 rounded focus:ring-green-500"
              />
              <label htmlFor="hasVariants" className="ml-2 text-sm font-medium text-dark">
                পরিমাণ নির্বাচন করুন (Has Variants)
              </label>
            </div>

            {formData.hasVariants && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-dark">Product Variants</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-3 py-1 text-white text-sm rounded transition-colors"
                    style={{ backgroundColor: '#6BCB8F' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
                  >
                    + Add Variant
                  </button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">Variant {index + 1}</span>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Variant Name (Bangla) *
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400"
                          placeholder="e.g., ১ কেজি"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Variant Name (English)
                        </label>
                        <input
                          type="text"
                          value={variant.name_en}
                          onChange={(e) => updateVariant(index, 'name_en', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400"
                          placeholder="e.g., 1kg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Price (৳) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Old Price (৳) (optional)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.oldPrice}
                          onChange={(e) => updateVariant(index, 'oldPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`variant-inStock-${index}`}
                        checked={variant.inStock}
                        onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-700 rounded focus:ring-green-500"
                      />
                      <label htmlFor={`variant-inStock-${index}`} className="ml-2 text-sm text-gray-300">
                        In Stock
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Image *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileChange(e, 'main')}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading images...</p>
                )}
                {imagePreviews.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className={`w-32 h-32 object-cover rounded-lg border-2 ${formData.mainImageIndex === index ? 'border-green-500' : 'border-gray-200'}`}
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="radio"
                              name="mainImage"
                              checked={formData.mainImageIndex === index}
                              onChange={() => setFormData({ ...formData, mainImageIndex: index })}
                              className="w-5 h-5 accent-green-600"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {formData.mainImageIndex === index ? 'Main' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Select the radio button to mark as main image</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gallery Images (up to 2 for single page)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  disabled={galleryImagePreviews.length >= 2 || uploading}
                  ref={galleryFileInputRef}
                  onChange={(e) => handleFileChange(e, 'gallery')}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading images...</p>
                )}
                {galleryImagePreviews.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {galleryImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
                            setFormData(prev => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">Upload images one by one (max 2)</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Bangla)
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (English)
            </label>
            <textarea
              rows={4}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              বিস্তারিত (Details for Single Product Page)
            </label>
            <textarea
              rows={6}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Enter detailed product information that will appear in the 'বিস্তারিত' section on the single product page..."
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
            />
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Enter SEO title (recommended: 50-60 characters)"
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Enter SEO description (recommended: 150-160 characters)"
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  placeholder="Enter keywords separated by commas (e.g., organic honey, pure ghee, natural food)"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple keywords with commas
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-700 rounded focus:ring-green-500"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-300">
              In Stock
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#6BCB8F' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5AB87E')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
