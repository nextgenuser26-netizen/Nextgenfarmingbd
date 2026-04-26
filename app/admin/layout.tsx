'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  Tag,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Landmark,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const admin = localStorage.getItem('admin');
    if (!admin && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }

    // Only fetch unread count if authenticated
    if (admin) {
      fetchUnreadCount();
      // Poll for new messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);

      // Listen for custom event to refresh count
      const handleRefresh = () => fetchUnreadCount();
      window.addEventListener('refreshUnreadCount', handleRefresh);

      return () => {
        clearInterval(interval);
        window.removeEventListener('refreshUnreadCount', handleRefresh);
      };
    }
  }, [pathname, router]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/messages/unread-count');
      if (!res.ok) {
        console.error('Failed to fetch unread count:', res.status);
        return;
      }
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Deals', href: '/admin/deals', icon: Tag },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Landing Pages', href: '/admin/landing-pages', icon: Landmark },
    { name: 'Ticker Messages', href: '/admin/ticker-messages', icon: Globe },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'SEO Management', href: '/admin/seo', icon: Search },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  // Don't render if checking authentication or on login page
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isMessages = item.name === 'Messages';
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  style={isActive ? { backgroundColor: '#8B4513' } : {}}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5 mr-3" />
                    {isMessages && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8B4513'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgb(209 213 219)'; }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 shadow-sm border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              Welcome, Admin
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
