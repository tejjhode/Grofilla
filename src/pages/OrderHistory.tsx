import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../store/slices/orderSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const customerId = '17';

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${statusColorMap[status] || 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
};

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchCustomerOrders(customerId));
  }, [dispatch]);

  const handleOrderClick = (orderId: number) => {
    // navigate(`/order-details/${orderId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-72">
            <div className="h-48 bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        Error: {error || 'Unable to fetch orders. Try again later.'}
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center mt-12 text-gray-600">
        <h2 className="text-2xl font-semibold">No orders found</h2>
        <p className="mt-2">Start shopping to see your order history!</p>
      </div>
    );
  }

  const reversedOrders = [...orders].reverse();

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Orders</h1>

      <div className="grid gap-8">
        {reversedOrders.map((order) => (
          <div
            key={order.orderId}
            onClick={() => handleOrderClick(order.orderId)}
            className="bg-white shadow-xl rounded-2xl transition-all hover:scale-[1.01] hover:shadow-2xl cursor-pointer border border-gray-100"
          >
            <div className="flex justify-between items-start px-6 pt-6">
              <div>
                <p className="text-base font-medium text-gray-600">Order #{order.orderId}</p>
                <p className="text-sm text-gray-400">
                  Placed on: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="px-6 py-4 divide-y divide-gray-200">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                    <div className="max-w-xs">
                      <p className="font-semibold text-base text-gray-800 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-base font-semibold text-green-700">₹{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t bg-gray-100 flex justify-between items-center rounded-b-2xl">
              {order.status === 'ACCEPTED' ? (
                <button
                  className="text-sm text-blue-600 flex items-center hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/track-order`);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-1" /> Track Order
                </button>
              ) : (
                <span />
              )}

              <p className="text-lg font-bold text-gray-800">
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;