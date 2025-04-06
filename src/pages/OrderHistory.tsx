import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../store/slices/orderSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Package, MapPin } from 'lucide-react';

const customerId = '0';

const statusColorMap: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full ${statusColorMap[status] || 'bg-gray-100 text-gray-700'}`}
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div>
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
        <h2 className="text-xl font-semibold">No orders found</h2>
        <p className="mt-2">Start shopping to see your order history!</p>
      </div>
    );
  }

  const reversedOrders = [...orders].reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      <div className="grid gap-6">
        {reversedOrders.map((order) => (
          <div
            key={order.orderId}
            onClick={() => handleOrderClick(order.orderId)}
            className="bg-white shadow-lg rounded-xl transition-transform hover:scale-[1.01] hover:shadow-xl cursor-pointer"
          >
            {/* Header */}
            <div className="flex justify-between items-start px-6 pt-6">
              <div>
                <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                <p className="text-xs text-gray-400">
                  Placed on: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Items */}
            <div className="px-6 py-4 space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-none last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-md border"
                    />
                    <div className="max-w-xs">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-green-700">₹{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center rounded-b-xl">
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