'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners?limit=50');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchBanners();
      } else {
        alert('Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      
      if (res.ok) {
        fetchBanners();
      } else {
        alert('Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = banners.findIndex((b: any) => b._id === id);
    const newBanners = [...banners];
    
    if (direction === 'up' && index > 0) {
      [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    } else if (direction === 'down' && index < banners.length - 1) {
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    } else {
      return;
    }

    try {
      await Promise.all(
        newBanners.map((banner: any, i: number) =>
          fetch(`/api/banners/${banner._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: i + 1 }),
          })
        )
      );
      fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
      alert('Failed to reorder banners');
    }
  };

  const filteredBanners = banners.filter((banner: any) =>
    banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.title_en?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: any, b: any) => a.order - b.order);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Banners</h1>
        <Link
          href="/admin/banners/new"
          className="flex items-center px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#6BCB8F' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Banner
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
          />
        </div>
      </div>

      {/* Banners Grid */}
      <div className="space-y-4">
        {filteredBanners.map((banner: any, index: number) => (
          <div key={banner._id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
              {banner.title_en && (
                <p className="text-sm text-gray-500">{banner.title_en}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {banner.position}
                </span>
                <span className="text-sm text-gray-500">Order: {banner.order}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleReorder(banner._id, 'up')}
                disabled={index === 0}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleReorder(banner._id, 'down')}
                disabled={index === filteredBanners.length - 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleToggleActive(banner._id, banner.isActive)}
                className={banner.isActive ? 'text-green-600' : 'text-gray-400'}
              >
                {banner.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <Link
                href={`/admin/banners/${banner._id}/edit`}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <button
                onClick={() => handleDelete(banner._id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredBanners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No banners found
        </div>
      )}
    </div>
  );
}
