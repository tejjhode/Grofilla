import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ShoppingBag, TrendingUp, IndianRupee, Search, BarChart3, AlertTriangle } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { fetchShopkeeperOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { fetchShopkeeperProducts } from '../store/slices/productSlice';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ShopkeeperDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const { products } = useSelector((state: RootState) => state.products);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const shopkeeperData = localStorage.getItem('user');
  const shopkeeperId = shopkeeperData ? JSON.parse(shopkeeperData).id : null;

  useEffect(() => {
    if (shopkeeperId) {
      dispatch(fetchShopkeeperOrders());
      dispatch(fetchShopkeeperProducts(shopkeeperId));
    }
  }, [dispatch, shopkeeperId]);

  const handleUpdateStatus = async (orderId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await dispatch(updateOrderStatus({ orderId, shopkeeperId, status })).unwrap();
      toast.success(`Order ${status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}`);
    } catch (error) {
      toast.error('Failed to update order status.');
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      await dispatch(updateOrderStatus({ orderId, shopkeeperId, status: 'DELIVERED' })).unwrap();
      toast.success('Order marked as delivered');
    } catch (error) {
      toast.error('Failed to mark order as delivered');
    }
  };

  if (loading) return <p className="text-center text-lg font-medium">Loading orders...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!orders || !Array.isArray(orders)) return <p className="text-center">No orders found.</p>;

  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  const displayedOrders = selectedTab === 'pending' ? pendingOrders : orders;

  const filteredOrders = displayedOrders.filter(order =>
    order.orderId.toString().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = orders
    .filter(order => order.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Top Selling Products
  const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number; imageUrl: string }>();
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productSalesMap.has(item.id)) {
        const existing = productSalesMap.get(item.id)!;
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
      } else {
        productSalesMap.set(item.id, {
          name: item.name,
          quantity: item.quantity,
          revenue: item.totalPrice,
          imageUrl: item.imageUrl,
        });
      }
    });
  });

  const topSellingProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Low stock products
  const lowStockProducts = products.filter(product => product.stock <= 10);

  // Chart data (daily revenue)
  const revenuePerDate: { [date: string]: number } = {};
  orders.forEach(order => {
    if (order.status === 'DELIVERED') {
      const date = new Date(order.orderDate).toLocaleDateString();
      revenuePerDate[date] = (revenuePerDate[date] || 0) + order.totalAmount;
    }
  });
  const chartData = Object.entries(revenuePerDate).map(([date, total]) => ({
    date,
    total,
  }));

  const weekdayRevenue: { [day: string]: number } = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };
  
  orders.forEach(order => {
    if (order.status === 'DELIVERED') {
      const dayIndex = new Date(order.orderDate).getDay(); // 0 (Sunday) to 6 (Saturday)
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(order.orderDate));
      weekdayRevenue[dayName] += order.totalAmount;
    }
  });
  
  const weekdayChartData = Object.entries(weekdayRevenue).map(([day, total]) => ({
    day,
    total,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Shopkeeper Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Orders', value: orders.length, icon: <Package className="text-blue-500" /> },
          { title: 'Pending Orders', value: pendingOrders.length, icon: <ShoppingBag className="text-yellow-500" /> },
          { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: <IndianRupee className="text-green-500" /> },
          { title: 'Growth', value: '+12.5%', icon: <TrendingUp className="text-purple-500" /> },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <p className="text-gray-500 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
        <div className="flex items-center mb-4 gap-2">
          <BarChart3 className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-700">Revenue by Weekday</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weekdayChartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs + Search */}
<div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
  {/* Tabs */}
  <div className="flex border-b border-gray-200">
    {['pending', 'all'].map((tab) => (
      <button
        key={tab}
        className={`px-6 py-2 font-medium capitalize ${
          selectedTab === tab
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => setSelectedTab(tab as 'pending' | 'all')}
      >
        {tab === 'pending' ? 'Pending Orders' : 'All Orders'}
      </button>
    ))}
  </div>

  {/* Search Input */}
  <div className="relative w-full md:w-1/3">
    <input
      type="text"
      placeholder="Search by product or order ID..."
      className="w-full py-2 pl-10 pr-4 border rounded-xl shadow-sm focus:outline-none focus:ring focus:border-green-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  </div>
</div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.orderId} className="border-b p-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID: <span className="text-gray-800 font-medium">{order.orderId}</span></p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Customer ID: {order.customerId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm transition-transform hover:scale-105">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded-lg mr-4" />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-green-600 font-semibold">₹{item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-lg font-bold text-gray-700">Total: ₹{order.totalAmount.toFixed(2)}</div>
                {order.status === 'PENDING' && (
                  <div className="space-x-3">
                    <button
                      onClick={() => handleUpdateStatus(order.orderId, 'REJECTED')}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-xl text-sm hover:bg-red-50 transition duration-200"
                    >Reject</button>
                    <button
                      onClick={() => handleUpdateStatus(order.orderId, 'ACCEPTED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition duration-200"
                    >Accept</button>
                  </div>
                )}
                {order.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleMarkDelivered(order.orderId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition duration-200"
                  >Mark as Delivered</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No orders to display.</p>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;