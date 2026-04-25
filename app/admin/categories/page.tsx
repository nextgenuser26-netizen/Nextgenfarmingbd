'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter((category: any) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#6BCB8F' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category: any) => (
          <div key={category._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/categories/${category._id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{category.name_en}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {category.subcategories?.map((sub: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {sub}
                  </span>
                ))}
              </div>
              {category.variants?.length > 0 && (
                <div className="space-y-2">
                  {category.variants.map((variant: any, index: number) => (
                    <div key={index} className="text-xs">
                      <span className="font-semibold text-gray-700">{variant.name}:</span>
                      <span className="text-green-700 ml-1">{variant.options.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No categories found
        </div>
      )}
    </div>
  );
}
