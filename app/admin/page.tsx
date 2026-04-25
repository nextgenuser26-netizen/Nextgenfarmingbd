'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, FileText, Tag, ImageIcon, FolderTree, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    blogs: 0,
    deals: 0,
    banners: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    // Fetch stats from APIs
    fetchStats();
    fetchSalesData();
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [selectedPeriod, customStartDate, customEndDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch each API independently to handle failures gracefully
      const fetchWithFallback = async (url: string, fallback: any) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return fallback;
          return await res.json();
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
          return fallback;
        }
      };

      const [productsData, categoriesData, ordersData, blogsData, dealsData, bannersData] = await Promise.all([
        fetchWithFallback('/api/products?limit=1', { pagination: { total: 0 } }),
        fetchWithFallback('/api/categories', { categories: [] }),
        fetchWithFallback('/api/orders?limit=1', { pagination: { total: 0 } }),
        fetchWithFallback('/api/blogs?limit=1', { total: 0 }),
        fetchWithFallback('/api/deals?limit=1', { total: 0 }),
        fetchWithFallback('/api/banners?limit=1', { total: 0 })
      ]);

      console.log('Dashboard stats:', {
        products: productsData,
        categories: categoriesData,
        orders: ordersData,
        blogs: blogsData,
        deals: dealsData,
        banners: bannersData
      });

      setStats({
        products: productsData.pagination?.total || productsData.total || 0,
        categories: categoriesData.categories?.length || 0,
        orders: ordersData.pagination?.total || ordersData.total || 0,
        blogs: blogsData.pagination?.total || blogsData.total || 0,
        deals: dealsData.pagination?.total || dealsData.total || 0,
        banners: bannersData.pagination?.total || bannersData.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    try {
      setSalesLoading(true);
      let url = '/api/admin/sales';
      
      if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
        url += `?startDate=${customStartDate}&endDate=${customEndDate}`;
      } else {
        url += `?period=${selectedPeriod}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setSalesData(data.salesData || []);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500', href: '/admin/products' },
    { name: 'Categories', value: stats.categories, icon: FolderTree, color: 'bg-purple-500', href: '/admin/categories' },
    { name: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500', href: '/admin/orders' },
    { name: 'Blogs', value: stats.blogs, icon: FileText, color: 'bg-orange-500', href: '/admin/blogs' },
    { name: 'Deals', value: stats.deals, icon: Tag, color: 'bg-red-500', href: '/admin/deals' },
    { name: 'Banners', value: stats.banners, icon: ImageIcon, color: 'bg-indigo-500', href: '/admin/banners' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome to your admin dashboard</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <a
                key={stat.name}
                href={stat.href}
                className="relative overflow-hidden bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Sales History Graph */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center mb-4 sm:mb-0">
                <TrendingUp className="w-5 h-5 mr-2" />
                Sales History
              </h2>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    if (e.target.value !== 'custom') {
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }
                  }}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                {selectedPeriod === 'custom' && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
            {salesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6BCB8F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6BCB8F" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B4513" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B4513" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Sales') return `৳${Number(value).toLocaleString()}`;
                      if (name === 'Orders') return `${value} orders`;
                      return value;
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6BCB8F" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="Sales"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8B4513" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/admin/products/new"
                className="flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#6BCB8F' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
              >
                Add New Product
              </a>
              <a
                href="/admin/categories/new"
                className="flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#6BCB8F' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
              >
                Add New Category
              </a>
              <a
                href="/admin/blogs/new"
                className="flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#6BCB8F' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5AB87E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
              >
                Write New Blog
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
