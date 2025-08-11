import React, { useState } from 'react';
import {
  Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, DollarSign,
  MapPin, User, Mail
} from 'lucide-react';

// Mock data
const initialOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: '1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Wireless Bluetooth Headphones',
        productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=150',
        quantity: 2,
        price: 99.99,
        total: 199.98
      },
      {
        id: '2',
        productId: '2',
        productName: 'Smart Watch Series 5',
        productImage: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=150',
        quantity: 1,
        price: 299.99,
        total: 299.99
      }
    ],
    subtotal: 499.97,
    tax: 45.00,
    shipping: 15.00,
    total: 559.97,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    trackingNumber: 'TRK123456789',
    notes: 'Customer requested expedited shipping',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    estimatedDelivery: '2024-01-18T00:00:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    items: [
      {
        id: '3',
        productId: '3',
        productName: 'Organic Cotton T-Shirt',
        productImage: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150',
        quantity: 3,
        price: 24.99,
        total: 74.97
      }
    ],
    subtotal: 74.97,
    tax: 6.75,
    shipping: 8.00,
    total: 89.72,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    trackingNumber: 'TRK987654321',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-16T11:45:00Z',
    estimatedDelivery: '2024-01-19T00:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: '3',
    customerName: 'Mike Wilson',
    customerEmail: 'mike.wilson@email.com',
    items: [
      {
        id: '4',
        productId: '4',
        productName: 'Smart Water Bottle',
        productImage: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=150',
        quantity: 1,
        price: 45.99,
        total: 45.99
      }
    ],
    subtotal: 45.99,
    tax: 4.14,
    shipping: 5.00,
    total: 55.13,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    createdAt: '2024-01-16T16:45:00Z',
    updatedAt: '2024-01-16T16:45:00Z'
  }
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateRange: '',
    searchTerm: ''
  });

  const filteredOrders = orders.filter(order => {
    const term = filters.searchTerm || '';
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
      order.customerName.toLowerCase().includes(term.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(term.toLowerCase());
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: '!bg-yellow-100', text: '!text-yellow-800', icon: Clock },
      processing: { bg: '!bg-blue-100', text: '!text-blue-800', icon: Package },
      shipped: { bg: '!bg-purple-100', text: '!text-purple-800', icon: Truck },
      delivered: { bg: '!bg-green-100', text: '!text-green-800', icon: CheckCircle },
      cancelled: { bg: '!bg-red-100', text: '!text-red-800', icon: XCircle },
      refunded: { bg: '!bg-gray-100', text: '!text-gray-800', icon: DollarSign }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${config.bg} ${config.text}`}>
        <Icon className="!w-3 !h-3 !mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { bg: '!bg-yellow-100', text: '!text-yellow-800' },
      paid: { bg: '!bg-green-100', text: '!text-green-800' },
      failed: { bg: '!bg-red-100', text: '!text-red-800' },
      refunded: { bg: '!bg-gray-100', text: '!text-gray-800' }
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;

    return (
      <span className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${config.bg} ${config.text}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  return (
    <div className="!p-4 !sm:p-6">
      {/* Header */}
      <div className="!flex !flex-col !sm:flex-row !justify-between !items-start !sm:items-center !mb-6">
        <div>
          <h1 className="!text-2xl !sm:text-3xl !font-bold !text-gray-900">Order Management</h1>
          <p className="!text-gray-600 !mt-1">Track and manage customer orders</p>
        </div>
        <div className="!mt-4 !sm:mt-0 !text-sm !text-gray-500">
          Total Orders: <span className="!font-semibold !text-gray-900">{orders.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 !sm:p-6 !mb-6">
        <div className="!grid !grid-cols-1 !md:grid-cols-2 !lg:grid-cols-4 !gap-4">
          {/* Search */}
          <div className="!relative">
            <Search className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-gray-400 !w-4 !h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="!w-full !pl-10 !pr-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="!px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Payment Status */}
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
            className="!px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Date Range */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="!px-4 !py-2 !border !border-gray-300 !rounded-lg !focus:ring-2 !focus:ring-blue-500"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !overflow-x-auto">
        <table className="!w-full !text-sm">
          <thead className="!bg-gray-50">
            <tr>
              {['Order', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Actions'].map((head) => (
                <th key={head} className="!px-4 !sm:px-6 !py-3 !text-left !font-medium !text-gray-500 !uppercase !tracking-wider">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="!divide-y !divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="!hover:bg-gray-50">
                <td className="!px-4 !sm:px-6 !py-4">{order.orderNumber}<div className="!text-xs !text-gray-500">{order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ''}</div></td>
                <td className="!px-4 !sm:px-6 !py-4">{order.customerName}<div className="!text-xs !text-gray-500">{order.customerEmail}</div></td>
                <td className="!px-4 !sm:px-6 !py-4">{order.items.length} item(s)</td>
                <td className="!px-4 !sm:px-6 !py-4">{formatCurrency(order.total)}</td>
                <td className="!px-4 !sm:px-6 !py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="!text-xs !border !border-gray-300 !rounded !px-2 !py-1 !focus:ring-2 !focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="!px-4 !sm:px-6 !py-4">{getPaymentStatusBadge(order.paymentStatus)}</td>
                <td className="!px-4 !sm:px-6 !py-4">{formatDate(order.createdAt)}</td>
                <td className="!px-4 !sm:px-6 !py-4">
                  <button onClick={() => openOrderDetails(order)} className="!text-blue-600 !hover:text-blue-900">
                    <Eye className="!w-4 !h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="!text-center !py-12">
          <div className="!w-20 !h-20 !mx-auto !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
            <Package className="!w-8 !h-8 !text-gray-400" />
          </div>
          <h3 className="!text-lg !font-medium">No orders found</h3>
          <p className="!text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="!fixed !inset-0 !bg-black !bg-opacity-50 !flex !items-center !justify-center !p-4 !z-50">
          <div className="!bg-white !rounded-xl !shadow-2xl !w-full !max-w-4xl !max-h-[90vh] !overflow-y-auto">
            <div className="!flex !justify-between !items-center !p-4 !border-b !border-gray-200">
              <div>
                <h2 className="!text-xl !sm:text-2xl !font-bold">Order Details</h2>
                <p className="!text-gray-600">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={closeOrderDetails} className="!text-gray-400 !hover:text-gray-600">
                <XCircle className="!w-6 !h-6" />
              </button>
            </div>

            <div className="!p-4 !sm:p-6">
              <div className="!grid !grid-cols-1 !lg:grid-cols-2 !gap-8">
                {/* Order Info */}
                <div>
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Order Information</h3>
                  <div className="!space-y-3">
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Payment Status:</span>
                      {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    </div>
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Payment Method:</span>
                      <span className="!font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="!flex !justify-between">
                      <span className="!text-gray-600">Order Date:</span>
                      <span className="!font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Estimated Delivery:</span>
                        <span className="!font-medium">{formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                    )}
                    {selectedOrder.trackingNumber && (
                      <div className="!flex !justify-between">
                        <span className="!text-gray-600">Tracking Number:</span>
                        <span className="!font-medium">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Customer Information</h3>
                  <div className="!space-y-3">
                    <div className="!flex !items-center">
                      <User className="!w-4 !h-4 !text-gray-400 !mr-2" />
                      <span className="!font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="!flex !items-center">
                      <Mail className="!w-4 !h-4 !text-gray-400 !mr-2" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="!flex !items-start">
                      <MapPin className="!w-4 !h-4 !text-gray-400 !mr-2 !mt-0.5" />
                      <div>
                        <div>{selectedOrder.shippingAddress.street}</div>
                        <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</div>
                        <div>{selectedOrder.shippingAddress.country}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="!mt-8">
                <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Order Items</h3>
                <div className="!space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="!flex !items-center !p-4 !bg-gray-50 !rounded-lg">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="!w-16 !h-16 !object-cover !rounded-lg !mr-4"
                      />
                      <div className="!flex-1">
                        <h4 className="!font-medium !text-gray-900">{item.productName}</h4>
                        <p className="!text-sm !text-gray-600">Quantity: {item.quantity}</p>
                        <p className="!text-sm !text-gray-600">Price: {formatCurrency(item.price)}</p>
                      </div>
                      <div className="!text-right">
                        <p className="!font-semibold !text-gray-900">{formatCurrency(item.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="!mt-8 !bg-gray-50 !rounded-lg !p-6">
                <h3 className="!text-lg !font-semibold !text-gray-900 !mb-4">Order Summary</h3>
                <div className="!space-y-2">
                  <div className="!flex !justify-between">
                    <span className="!text-gray-600">Subtotal:</span>
                    <span className="!font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="!flex !justify-between">
                    <span className="!text-gray-600">Tax:</span>
                    <span className="!font-medium">{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="!flex !justify-between">
                    <span className="!text-gray-600">Shipping:</span>
                    <span className="!font-medium">{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="!border-t !border-gray-200 !pt-2 !mt-2">
                    <div className="!flex !justify-between">
                      <span className="!text-lg !font-semibold !text-gray-900">Total:</span>
                      <span className="!text-lg !font-bold !text-gray-900">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="!mt-6">
                  <h3 className="!text-lg !font-semibold !text-gray-900 !mb-2">Notes</h3>
                  <p className="!text-gray-600 !bg-yellow-50 !p-4 !rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
