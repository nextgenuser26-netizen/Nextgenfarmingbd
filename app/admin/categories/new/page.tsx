'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

export default function NewCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    icon: '',
    subcategories: [''],
  });

  const handleAddSubcategory = () => {
    setFormData({ ...formData, subcategories: [...formData.subcategories, ''] });
  };

  const handleRemoveSubcategory = (index: number) => {
    const newSubcategories = formData.subcategories.filter((_, i) => i !== index);
    setFormData({ ...formData, subcategories: newSubcategories });
  };

  const handleSubcategoryChange = (index: number, value: string) => {
    const newSubcategories = [...formData.subcategories];
    newSubcategories[index] = value;
    setFormData({ ...formData, subcategories: newSubcategories });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subcategories: formData.subcategories.filter(s => s.trim() !== ''),
        }),
      });

      if (res.ok) {
        router.push('/admin/categories');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Category</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category Name (Bangla) *
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
              <label className="block text-sm font-medium text-white mb-2">
                Category Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Icon (Emoji) *
              </label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                placeholder="e.g., 🥕"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Subcategories
            </label>
            <div className="space-y-2">
              {formData.subcategories.map((subcategory, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
                    placeholder="Subcategory name"
                  />
                  {formData.subcategories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="flex items-center px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Subcategory
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/categories"
              className="px-6 py-2 border border-gray-700 text-white rounded-lg hover:bg-gray-50 transition-colors"
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
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
