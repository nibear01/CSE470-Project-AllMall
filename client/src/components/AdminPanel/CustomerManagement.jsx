/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Filter, UserCheck, UserX, Shield, Users, X } from 'lucide-react';

// Mock data for demonstration
const initialCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    totalOrders: 15,
    totalSpent: 2450.75,
    status: 'active',
    joinedDate: '2023-06-15T10:30:00Z',
    lastOrderDate: '2024-01-10T14:20:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    totalOrders: 8,
    totalSpent: 1200.50,
    status: 'active',
    joinedDate: '2023-08-22T09:15:00Z',
    lastOrderDate: '2024-01-08T11:45:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    totalOrders: 3,
    totalSpent: 450.25,
    status: 'inactive',
    joinedDate: '2023-11-10T16:45:00Z',
    lastOrderDate: '2023-12-15T13:30:00Z',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalCustomer, setModalCustomer] = useState(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(prev => prev.map(customer =>
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: '!bg-green-100', text: '!text-green-800', icon: UserCheck },
      inactive: { bg: '!bg-gray-100', text: '!text-gray-800', icon: UserX },
      blocked: { bg: '!bg-red-100', text: '!text-red-800', icon: Shield }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`!inline-flex !items-center !px-2.5 !py-0.5 !rounded-full !text-xs !font-medium ${config.bg} ${config.text}`}>
        <Icon className="!w-3 !h-3 !mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="!p-4 sm:!p-6">
      {/* Header */}
      <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !mb-6">
        <div>
          <h1 className="!text-2xl sm:!text-3xl !font-bold !text-gray-900">Customer Management</h1>
          <p className="!text-gray-600 !mt-1">Manage customer accounts and view customer details</p>
        </div>
      </div>

      {/* Filters */}
      <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 sm:!p-6 !mb-6">
        <div className="!flex !flex-col lg:!flex-row !gap-4">
          <div className="!flex-1">
            <div className="!relative">
              <Search className="!absolute !left-3 !top-1/2 !transform -!translate-y-1/2 !text-gray-400 !w-4 !h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!w-full !pl-10 !pr-4 !py-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !transition-colors !duration-200"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="!px-4 !py-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !transition-colors !duration-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 xl:!grid-cols-3 !gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !p-4 sm:!p-6 hover:!shadow-md !transition-shadow !duration-200 !cursor-pointer"
            onClick={() => setModalCustomer(customer)}
          >
            <div className="!flex !items-start !justify-between !mb-4">
              <div className="!flex !items-center">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="!w-12 !h-12 !rounded-full !object-cover !mr-3"
                />
                <div>
                  <h3 className="!text-lg !font-semibold !text-gray-900">{customer.name}</h3>
                  <p className="!text-sm !text-gray-500">Joined {formatDate(customer.joinedDate)}</p>
                </div>
              </div>
              {getStatusBadge(customer.status)}
            </div>
            <div className="!space-y-2 !mb-4">
              <div className="!flex !items-center !text-sm !text-gray-600">
                <Mail className="!w-4 !h-4 !mr-2" /> {customer.email}
              </div>
              <div className="!flex !items-center !text-sm !text-gray-600">
                <Phone className="!w-4 !h-4 !mr-2" /> {customer.phone}
              </div>
              <div className="!flex !items-center !text-sm !text-gray-600">
                <MapPin className="!w-4 !h-4 !mr-2" /> {customer.address.city}, {customer.address.state}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="!text-center !py-12">
          <div className="!w-24 !h-24 !mx-auto !bg-gray-100 !rounded-full !flex !items-center !justify-center !mb-4">
            <Users className="!w-8 !h-8 !text-gray-400" />
          </div>
          <h3 className="!text-lg !font-medium !text-gray-900 !mb-2">No customers found</h3>
          <p className="!text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Modal */}
      {modalCustomer && (
        <div className="!fixed !inset-0 !bg-black/50 !flex !items-center !justify-center !z-50">
          <div className="!bg-white !rounded-xl !p-6 !w-11/12 sm:!w-2/3 lg:!w-1/2 !max-h-[90vh] !overflow-y-auto !relative">
            <button
              onClick={() => setModalCustomer(null)}
              className="!absolute !top-3 !right-3 !text-gray-500 hover:!text-gray-800"
            >
              <X className="!w-6 !h-6" />
            </button>
            <div className="!flex !flex-col sm:!flex-row !items-center sm:!items-start !gap-4">
              <img
                src={modalCustomer.avatar}
                alt={modalCustomer.name}
                className="!w-24 !h-24 !rounded-full !object-cover"
              />
              <div>
                <h2 className="!text-xl !font-bold !text-gray-900">{modalCustomer.name}</h2>
                {getStatusBadge(modalCustomer.status)}
                <p className="!text-gray-500 !mt-1">Joined {formatDate(modalCustomer.joinedDate)}</p>
                <p className="!text-gray-500">Last Order: {formatDate(modalCustomer.lastOrderDate)}</p>
              </div>
            </div>
            <div className="!mt-4 !space-y-2">
              <div className="!flex !items-center">
                <Mail className="!w-5 !h-5 !mr-2 !text-gray-600" /> {modalCustomer.email}
              </div>
              <div className="!flex !items-center">
                <Phone className="!w-5 !h-5 !mr-2 !text-gray-600" /> {modalCustomer.phone}
              </div>
              <div className="!flex !items-start">
                <MapPin className="!w-5 !h-5 !mr-2 !text-gray-600" />
                <span>{modalCustomer.address.street}, {modalCustomer.address.city}, {modalCustomer.address.state} {modalCustomer.address.zipCode}, {modalCustomer.address.country}</span>
              </div>
            </div>
            <div className="!grid !grid-cols-2 !gap-4 !mt-4">
              <div className="!text-center !p-3 !bg-gray-50 !rounded-lg">
                <p className="!text-2xl !font-bold">{modalCustomer.totalOrders}</p>
                <p className="!text-gray-500">Orders</p>
              </div>
              <div className="!text-center !p-3 !bg-gray-50 !rounded-lg">
                <p className="!text-2xl !font-bold">${modalCustomer.totalSpent.toFixed(2)}</p>
                <p className="!text-gray-500">Total Spent</p>
              </div>
            </div>
            <div className="!mt-6 !flex !justify-end">
              <button
                onClick={() => setModalCustomer(null)}
                className="!px-4 !py-2 !bg-blue-600 !text-white !rounded-lg hover:!bg-blue-700 !transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
