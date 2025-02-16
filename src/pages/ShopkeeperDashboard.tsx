import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { fetchShopkeeperOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { RootState, AppDispatch } from '../store';

const ShopkeeperDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const shopkeeperId = localStorage.getItem('shopkeeperId');

  useEffect(() => {
    if (shopkeeperId) {
      dispatch(fetchShopkeeperOrders(shopkeeperId));
    }
  }, [dispatch, shopkeeperId]);

  const handleUpdateStatus = async (orderId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await dispatch(updateOrderStatus({ orderId, shopkeeperId, status })).unwrap();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const pendingOrders = orders.filter((order) => order.status === 'PENDING');
  const displayedOrders = selectedTab === 'pending' ? pendingOrders : orders;

  const totalRevenue = orders
    .filter((order) => order.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopkeeper Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[ 
          { title: 'Total Orders', value: orders.length, icon: <Package className="h-6 w-6 text-blue-500" /> },
          { title: 'Pending Orders', value: pendingOrders.length, icon: <ShoppingBag className="h-6 w-6 text-yellow-500" /> },
          { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign className="h-6 w-6 text-green-500" /> },
          { title: 'Growth', value: '+12.5%', icon: <TrendingUp className="h-6 w-6 text-purple-500" /> }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 flex">
          {['pending', 'all'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium ${selectedTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setSelectedTab(tab as 'pending' | 'all')}
            >
              {tab === 'pending' ? 'Pending Orders' : 'All Orders'}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-200">
          {displayedOrders.length ? displayedOrders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>{order.status}</span>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.quantity * item.product.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-xl font-bold">Total: ${order.totalAmount.toFixed(2)}</div>
                {order.status === 'PENDING' && (
                  <div className="space-x-4">
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'REJECTED')}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                    >Reject</button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >Accept</button>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;