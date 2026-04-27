'use client';

import { useEffect, useState } from 'react';
import { Trash2, Search, Download, Mail, Users, Calendar } from 'lucide-react';

export default function AdminNewsletter() {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewsletters, setSelectedNewsletters] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNewsletters();
    markAllAsRead();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const res = await fetch('/api/newsletter?limit=100');
      const data = await res.json();
      setNewsletters(data.newsletters || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/newsletter/mark-read', { method: 'POST' });
      window.dispatchEvent(new CustomEvent('refreshUnreadNewsletterCount'));
    } catch (error) {
      console.error('Error marking newsletters as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      const res = await fetch(`/api/newsletter/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchNewsletters();
      } else {
        alert('Failed to delete subscription');
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('Failed to delete subscription');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedNewsletters.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedNewsletters.size} subscriptions?`)) return;

    try {
      for (const id of selectedNewsletters) {
        await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
      }
      setSelectedNewsletters(new Set());
      fetchNewsletters();
    } catch (error) {
      console.error('Error batch deleting newsletters:', error);
      alert('Failed to delete subscriptions');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Email', 'Status', 'Subscribed Date'];
    const rows = newsletters.map((n: any) => [
      n.email,
      n.isActive ? 'Active' : 'Inactive',
      new Date(n.subscribedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredNewsletters = newsletters.filter((n: any) =>
    n.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedNewsletters.size === filteredNewsletters.length) {
      setSelectedNewsletters(new Set());
    } else {
      setSelectedNewsletters(new Set(filteredNewsletters.map((n: any) => n._id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading newsletters...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Newsletter Subscriptions</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#6BCB8F' }}
          >
            <Download size={16} />
            Export CSV
          </button>
          {selectedNewsletters.size > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Delete ({selectedNewsletters.size})
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Subscribers</p>
              <p className="text-2xl font-bold text-white">{newsletters.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-white">{newsletters.filter((n: any) => n.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-white">
                {newsletters.filter((n: any) => {
                  const subDate = new Date(n.subscribedAt);
                  const now = new Date();
                  const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                  return subDate >= monthAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedNewsletters.size === filteredNewsletters.length && filteredNewsletters.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredNewsletters.map((newsletter: any) => (
                <tr key={newsletter._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedNewsletters.has(newsletter._id)}
                      onChange={() => {
                        const newSet = new Set(selectedNewsletters);
                        if (newSet.has(newsletter._id)) {
                          newSet.delete(newsletter._id);
                        } else {
                          newSet.add(newsletter._id);
                        }
                        setSelectedNewsletters(newSet);
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {newsletter.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      newsletter.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {newsletter.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(newsletter.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(newsletter._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNewsletters.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No newsletters found
          </div>
        )}
      </div>
    </div>
  );
}
