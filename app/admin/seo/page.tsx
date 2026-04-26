'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSEO() {
  const [seoData, setSeoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    try {
      const res = await fetch('/api/seo');
      const data = await res.json();
      setSeoData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      setSeoData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SEO configuration?')) return;

    try {
      const res = await fetch(`/api/seo/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchSEO();
      } else {
        alert('Failed to delete SEO configuration');
      }
    } catch (error) {
      console.error('Error deleting SEO:', error);
      alert('Failed to delete SEO configuration');
    }
  };

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/seo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status === 'active' ? 'inactive' : 'active' }),
      });
      
      if (res.ok) {
        fetchSEO();
      } else {
        alert('Failed to update SEO configuration');
      }
    } catch (error) {
      console.error('Error updating SEO:', error);
      alert('Failed to update SEO configuration');
    }
  };

  const filteredSEO = seoData.filter((seo: any) =>
    seo.pageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.pagePath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.metaTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">SEO Management</h1>
        <Link
          href="/admin/seo/new"
          className="flex items-center px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: '#6BCB8F' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add SEO
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search SEO configurations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white bg-gray-800"
          />
        </div>
      </div>

      {/* SEO List */}
      <div className="space-y-4">
        {filteredSEO.map((seo: any) => (
          <div key={seo._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{seo.pageName}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    seo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {seo.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{seo.pagePath}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Title:</span> {seo.metaTitle}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Description:</span> {seo.metaDescription?.substring(0, 100)}...
                  </p>
                  {seo.metaKeywords && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Keywords:</span> {seo.metaKeywords}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleStatus(seo._id, seo.status)}
                  className={seo.status === 'active' ? 'text-green-600' : 'text-gray-400'}
                  title={seo.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {seo.status === 'active' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <Link
                  href={`/admin/seo/${seo._id}/edit`}
                  className="text-blue-600 hover:text-blue-900"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(seo._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredSEO.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No SEO configurations found
        </div>
      )}
    </div>
  );
}
