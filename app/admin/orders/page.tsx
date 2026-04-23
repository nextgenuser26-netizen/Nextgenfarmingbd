'use client';

import { useEffect, useState } from 'react';
import { Eye, Search, Filter, Trash2, X, MapPin, Phone, Mail, Package, CreditCard, Printer, Download, FileSpreadsheet, FileText, Check } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const itemsPerPage = 8;
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [batchDeleting, setBatchDeleting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    fetchSettings();
  }, [currentPage, statusFilter]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      let url = `/api/orders?limit=${itemsPerPage}&offset=${offset}`;
      
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders?id=${orderId}`);
      const data = await res.json();
      setSelectedOrder(data.order);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders?id=${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setSelectedOrder(updatedOrder);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedOrders(new Set()); // Clear selection on page change
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((order: any) => order._id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedOrders.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedOrders.size} orders?`)) return;

    setBatchDeleting(true);
    try {
      const deletePromises = Array.from(selectedOrders).map(orderId =>
        fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' })
      );

      await Promise.all(deletePromises);
      setSelectedOrders(new Set());
      fetchOrders();
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Failed to delete some orders');
    } finally {
      setBatchDeleting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders?id=${selectedOrder._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsModalOpen(false);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handlePrintOrder = () => {
    if (!selectedOrder) return;

    const printContent = `
      <html>
        <head>
          <title>Order Details - ${selectedOrder.orderNumber || selectedOrder._id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .company-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .company-logo {
              max-width: 150px;
              max-height: 80px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 10px 0;
            }
            .company-address {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .company-contact {
              color: #666;
              font-size: 12px;
              margin: 5px 0;
            }
            .header {
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .section {
              margin: 20px 0;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .section h2 {
              color: #555;
              margin-top: 0;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-row {
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 15px;
            }
            .status {
              padding: 5px 10px;
              border-radius: 3px;
              display: inline-block;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
            .status-processing { background-color: #e2e3e5; color: #383d41; }
            .status-shipped { background-color: #d4edda; color: #155724; }
            .status-delivered { background-color: #d4edda; color: #155724; }
            .status-cancelled { background-color: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          <div class="company-header">
            ${settings?.logo ? `<img src="${settings.logo}" alt="${settings.siteName}" class="company-logo" />` : ''}
            <div class="company-name">${settings?.siteName || 'NextGen FarmingBD'}</div>
            ${settings?.contactAddress ? `<div class="company-address">${settings.contactAddress}</div>` : ''}
            ${settings?.contactPhone ? `<div class="company-contact">Phone: ${settings.contactPhone}</div>` : ''}
            ${settings?.contactEmail ? `<div class="company-contact">Email: ${settings.contactEmail}</div>` : ''}
          </div>

          <div class="header">
            <h1>Order Details</h1>
            <p>Order Number: ${selectedOrder.orderNumber || selectedOrder._id}</p>
          </div>

          <div class="section">
            <h2>Customer Information</h2>
            <div class="info-row"><span class="label">Name:</span> ${selectedOrder.customerName}</div>
            <div class="info-row"><span class="label">Phone:</span> ${selectedOrder.customerPhone}</div>
            <div class="info-row"><span class="label">Email:</span> ${selectedOrder.customerEmail || 'N/A'}</div>
          </div>

          <div class="section">
            <h2>Shipping Address</h2>
            <p>${selectedOrder.shippingAddress?.street}, ${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.state}, ${selectedOrder.shippingAddress?.zipCode}, ${selectedOrder.shippingAddress?.country}</p>
          </div>

          <div class="section">
            <h2>Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${selectedOrder.items?.map((item: any) => `
                  <tr>
                    <td>${item.name}${item.variant ? `<br><small style="color: #666; font-size: 11px;">${item.variant}</small>` : ''}</td>
                    <td>৳${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>৳${item.price * item.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">Total: ৳${selectedOrder.totalAmount}</div>
          </div>

          <div class="section">
            <h2>Payment Information</h2>
            <div class="info-row"><span class="label">Payment Method:</span> ${selectedOrder.paymentMethod}</div>
            <div class="info-row"><span class="label">Payment Status:</span> ${selectedOrder.paymentStatus}</div>
          </div>

          ${selectedOrder.notes ? `
          <div class="section">
            <h2>Order Notes</h2>
            <p>${selectedOrder.notes}</p>
          </div>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportCSV = () => {
    const ordersToExport = filteredOrders;

    // CSV headers with company info
    const headers = ['Order Number', 'Customer Name', 'Phone', 'Total Amount', 'Status', 'Payment Method', 'Payment Status', 'Date'];

    // CSV rows
    const rows = ordersToExport.map((order: any) => [
      order.orderNumber || order._id,
      order.customerName,
      order.customerPhone,
      order.totalAmount,
      order.status,
      order.paymentMethod,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    // Create CSV content with company info at the top
    const companyInfo = [
      `Company: ${settings?.siteName || 'NextGen FarmingBD'}`,
      settings?.contactAddress ? `Address: ${settings.contactAddress}` : '',
      settings?.contactPhone ? `Phone: ${settings.contactPhone}` : '',
      settings?.contactEmail ? `Email: ${settings.contactEmail}` : '',
      '',
      'Order Data:',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].filter(line => line !== '').join('\n');

    // Create download link
    const blob = new Blob([companyInfo], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const ordersToExport = filteredOrders;

    const pdfContent = `
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            .company-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .company-logo {
              max-width: 150px;
              max-height: 80px;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 10px 0;
            }
            .company-info {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .header {
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .header p {
              color: #666;
              margin: 5px 0 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .status {
              padding: 5px 10px;
              border-radius: 3px;
              display: inline-block;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .status-confirmed { background-color: #d1ecf1; color: #0c5460; }
            .status-processing { background-color: #e2e3e5; color: #383d41; }
            .status-shipped { background-color: #d4edda; color: #155724; }
            .status-delivered { background-color: #d4edda; color: #155724; }
            .status-cancelled { background-color: #f8d7da; color: #721c24; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="company-header">
            ${settings?.logo ? `<img src="${settings.logo}" alt="${settings.siteName}" class="company-logo" />` : ''}
            <div class="company-name">${settings?.siteName || 'NextGen FarmingBD'}</div>
            ${settings?.contactAddress ? `<div class="company-info">${settings.contactAddress}</div>` : ''}
            ${settings?.contactPhone ? `<div class="company-info">Phone: ${settings.contactPhone}</div>` : ''}
            ${settings?.contactEmail ? `<div class="company-info">Email: ${settings.contactEmail}</div>` : ''}
          </div>
          <div class="header">
            <h1>Orders Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Orders: ${ordersToExport.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${ordersToExport.map((order: any) => `
                <tr>
                  <td>${order.orderNumber || order._id}</td>
                  <td>${order.customerName}</td>
                  <td>${order.customerPhone}</td>
                  <td>৳${order.totalAmount}</td>
                  <td><span class="status status-${order.status}">${order.status}</span></td>
                  <td>${order.paymentMethod}</td>
                  <td>${order.paymentStatus}</td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {selectedOrders.size > 0 && (
          <button
            onClick={handleBatchDelete}
            disabled={batchDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {batchDeleting ? 'Deleting...' : `Delete Selected (${selectedOrders.size})`}
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber || order._id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items?.length || 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">৳{order.totalAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-semibold">{selectedOrder.orderNumber || selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Shipping Address
                </h3>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city},{' '}
                  {selectedOrder.shippingAddress?.state}, {selectedOrder.shippingAddress?.zipCode},{' '}
                  {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.variant && (
                                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">{item.variant}</p>
                                )}
                                <p className="text-sm text-gray-500">{item.name_en}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">৳{item.price}</td>
                          <td className="px-4 py-3 text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">৳{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-lg font-bold text-gray-900">Total: ৳{selectedOrder.totalAmount}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Update Order Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updatingStatus}
                      className={`px-4 py-2 rounded-lg font-medium capitalize ${
                        selectedOrder.status === status
                          ? 'ring-2 ring-offset-2 ring-green-500'
                          : ''
                      } ${getStatusColor(status)} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="border-t pt-4">
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleting}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  {deleting ? 'Deleting...' : 'Delete Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
