import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchCustomerOrders } from '../store/slices/orderSlice';
import { RootState, AppDispatch } from '../store';

// ✅ Helper Component for Status Icons
const OrderStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'ACCEPTED':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'DELIVERED':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'REJECTED':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchCustomerOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // ✅ Ensure `orders` is always an array before using `.map()`
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
          <p className="text-gray-600">Start shopping to see your order history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <OrderStatusIcon status={order.status} />
                  <span className="font-semibold">{order.status}</span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-gray-600">
                        Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;