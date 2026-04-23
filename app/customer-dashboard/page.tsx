'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, ShoppingBag, LogOut, User, Phone, MapPin, Calendar, Clock, CheckCircle, XCircle, Truck, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Check if customer is logged in
    const storedCustomer = localStorage.getItem('customer');
    if (!storedCustomer) {
      router.push('/customer-login');
      return;
    }

    const parsedCustomer = JSON.parse(storedCustomer);
    setCustomer(parsedCustomer);
    fetchOrders(parsedCustomer.phone);
    fetchSettings();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchOrders = async (phone: string) => {
    try {
      const response = await fetch(`/api/orders?customerPhone=${phone}`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    toast.success('লগআউট সফলভাবে সম্পন্ন হয়েছে');
    router.push('/');
  };

  const handlePrintInvoice = (order: any) => {
    setSelectedOrderForPrint(order);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-invoice');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;

      // Reload the page to restore React state
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <Header />
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-bold text-gray-600">লোড হচ্ছে...</div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Header />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Customer Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-8 shadow-xl border border-emerald-50 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900 italic">
                    {customer?.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{customer?.phone}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                লগআউট
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-lg border border-emerald-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">মোট অর্ডার</p>
                  <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-6 shadow-lg border border-emerald-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">সম্পন্ন অর্ডার</p>
                  <p className="text-2xl font-black text-gray-900">
                    {orders.filter((o: any) => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2rem] p-6 shadow-lg border border-emerald-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">চলমান অর্ডার</p>
                  <p className="text-2xl font-black text-gray-900">
                    {orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Orders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[3rem] p-8 shadow-xl border border-emerald-50"
          >
            <h2 className="text-2xl font-black text-gray-900 italic mb-6">আমার অর্ডারসমূহ</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-lg">আপনার কোনো অর্ডার নেই</p>
                <Link href="/shop" className="inline-block mt-4 text-emerald-600 font-bold hover:text-emerald-700">
                  শপিং শুরু করুন
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div
                    key={order._id}
                    className="border-2 border-gray-100 rounded-2xl p-6 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-black text-gray-900">
                            {order.orderNumber || order._id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.shippingAddress?.city}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePrintInvoice(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                          Print Invoice
                        </button>
                        <div className="text-right">
                          <p className="text-2xl font-black text-emerald-600">৳{order.totalAmount}</p>
                          <p className="text-sm text-gray-500">{order.items?.length} আইটেম</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items?.slice(0, 3).map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            {item.variant && (
                              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">{item.variant}</span>
                            )}
                            <span className="text-sm text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                            <span className="text-sm font-medium text-gray-500">
                              +{order.items.length - 3} আরও
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Print Invoice Modal */}
          {selectedOrderForPrint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Order Invoice</h2>
                  <button
                    onClick={() => setSelectedOrderForPrint(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div id="print-invoice" className="p-6">
                  {/* Company Header */}
                  <div className="border-b pb-6 mb-6 text-center">
                    {settings?.logo && (
                      <img src={settings.logo} alt={settings.siteName} className="max-w-32 max-h-20 mx-auto mb-3" />
                    )}
                    <h2 className="text-xl font-bold text-gray-900">{settings?.siteName || 'NextGen FarmingBD'}</h2>
                    {settings?.contactAddress && (
                      <p className="text-sm text-gray-600 mt-1">{settings.contactAddress}</p>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {settings?.contactPhone && <span className="mx-2">Phone: {settings.contactPhone}</span>}
                      {settings?.contactEmail && <span className="mx-2">Email: {settings.contactEmail}</span>}
                    </div>
                  </div>

                  {/* Invoice Header */}
                  <div className="border-b pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">INVOICE</h1>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Number</p>
                        <p className="font-semibold">{selectedOrderForPrint.orderNumber || selectedOrderForPrint._id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold">{new Date(selectedOrderForPrint.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer Name</p>
                        <p className="font-semibold">{customer?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">{customer?.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Shipping Address</h3>
                    <p className="text-gray-900">
                      {selectedOrderForPrint.shippingAddress?.street},<br />
                      {selectedOrderForPrint.shippingAddress?.city}, {selectedOrderForPrint.shippingAddress?.state}<br />
                      {selectedOrderForPrint.shippingAddress?.zipCode}, {selectedOrderForPrint.shippingAddress?.country}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Items</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-semibold text-gray-600">Item</th>
                          <th className="text-center py-2 text-sm font-semibold text-gray-600">Qty</th>
                          <th className="text-right py-2 text-sm font-semibold text-gray-600">Price</th>
                          <th className="text-right py-2 text-sm font-semibold text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderForPrint.items?.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 text-sm">
                              {item.name}
                              {item.variant && (
                                <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">{item.variant}</span>
                              )}
                            </td>
                            <td className="py-3 text-sm text-center">{item.quantity}</td>
                            <td className="py-3 text-sm text-right">৳{item.price}</td>
                            <td className="py-3 text-sm text-right">৳{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="py-3 text-right font-semibold">Subtotal</td>
                          <td className="py-3 text-right font-semibold">
                            ৳{selectedOrderForPrint.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="py-3 text-right font-bold text-lg">Total</td>
                          <td className="py-3 text-right font-bold text-lg">৳{selectedOrderForPrint.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Delivery Charge Section */}
                  <div className="mb-6 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500">ডেলিভারি চার্জ</h3>
                        {selectedOrderForPrint.deliveryAreaName && (
                          <p className="text-xs text-gray-400 mt-1">{selectedOrderForPrint.deliveryAreaName}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-emerald-600">
                        ৳{(() => {
                          const itemsTotal = selectedOrderForPrint.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
                          const deliveryCharge = selectedOrderForPrint.deliveryCharge || (selectedOrderForPrint.totalAmount - itemsTotal);
                          return deliveryCharge > 0 ? deliveryCharge : 0;
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4">
                      <span className="text-lg font-bold text-gray-900">সর্বমোট</span>
                      <span className="text-2xl font-black text-emerald-600">৳{selectedOrderForPrint.totalAmount}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Status</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${getStatusColor(selectedOrderForPrint.status)}`}>
                      {getStatusIcon(selectedOrderForPrint.status)}
                      {selectedOrderForPrint.status}
                    </span>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Printer className="w-4 h-4 inline mr-2" />
                    Print
                  </button>
                  <button
                    onClick={() => setSelectedOrderForPrint(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
