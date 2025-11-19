import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingCart, Clock, UserCheck, RefreshCw, LogOut } from 'lucide-react';

const monthlyOrdersData = [
  { month: 'May', Orders: 0 },
  { month: 'Jun', Orders: 0 },
  { month: 'Jul', Orders: 0 },
  { month: 'Aug', Orders: 0 },
  { month: 'Sep', Orders: 0 },
  { month: 'Oct', Orders: 0 },
  { month: 'Nov', Orders: 5 },
];

const completionData = [
  { name: 'Complete', value: 1, color: '#10b981' },
  { name: 'Pending', value: 4, color: '#e5e7eb' },
];

const recentOrders = [
  {
    id: '#5',
    bag: 'B-001',
    status: 'PENDING',
    date: '11/12/2025',
  },
  {
    id: '#4',
    bag: 'B-001',
    status: 'PENDING',
    date: '11/11/2025',
  },
  {
    id: '#3',
    bag: 'B-001',
    status: 'PENDING',
    date: '11/10/2025',
  },
  {
    id: '#2',
    bag: 'B-001',
    status: 'PENDING',
    date: '11/09/2025',
  },
];

const StatCard = ({ icon: Icon, title, value, subtitle, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="p-3 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back! Here's an overview of your business.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value="1"
            subtitle="Registered users"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value="5"
            subtitle="0 orders today"
          />
          <StatCard
            icon={Clock}
            title="Pending Orders"
            value="4"
            subtitle="0 in progress"
          />
          <StatCard
            icon={UserCheck}
            title="Washermen"
            value="1"
            subtitle="Active staff members"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Orders Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Orders</h2>
              <p className="text-sm text-gray-500">Last 7 months overview</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="Orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Completion Rate</h2>
              <p className="text-sm text-gray-500">Order completion status</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <p className="text-4xl font-bold text-gray-900">20%</p>
                <p className="text-sm text-gray-500">Complete</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Pending:
                </span>
                <span className="font-medium text-gray-900">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  <span className="inline-block w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                  In Progress:
                </span>
                <span className="font-medium text-gray-900">0</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">1 of 5 orders completed</p>
          </div>
        </div>

        {/* Recent Orders & Today's Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <p className="text-sm text-gray-500 mb-4">Latest order activities</p>
            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      {order.bag.split('-')[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Order {order.id}</p>
                      <p className="text-xs text-gray-500">Bag: {order.bag}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Activity</h2>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6">{today}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-600 mt-1">New Orders</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-600 mt-1">Completed Today</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-600 mt-1">Pending</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Tip:</span> Check back regularly for new orders and updates on pending tasks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
