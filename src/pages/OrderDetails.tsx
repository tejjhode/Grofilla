import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchCustomerOrders } from '../store/slices/orderSlice';
import { RootState } from '../store';
import { Package, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>(); // Retrieve order ID from URL params
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  
  useEffect(() => {
    dispatch(fetchCustomerOrders('0')); // Adjust customer ID fetching logic as needed
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
          Error: {error || 'Something went wrong. Please try again later.'}
        </div>
      </div>
    );
  }

  const order = orders.find((order) => order.orderId.toString() === orderId); // Find the order with matching ID

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-600">The order you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

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
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-5">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
              <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <OrderStatusIcon status={order.status} />
              <span className="font-semibold">{order.status}</span>
            </div>
          </div>

          {/* Show product details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {order.products.map((product) => (
              <div key={product.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                <h3 className="font-semibold mt-4">{product.name}</h3>
                <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Show estimated delivery time if the order is accepted */}
          {order.status === 'ACCEPTED' && (
            <div className="mt-6">
              <h4 className="font-semibold">Estimated Delivery Time:</h4>
              <p className="text-gray-600">{order.estimatedDeliveryTime}</p>
            </div>
          )}
          
          {/* Track Order link */}
          {order.status === 'ACCEPTED' && (
            <div className="mt-4">
              <Link to={`/track-order/${order.orderId}`} className="text-gray-700 hover:text-green-600 flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                Track Order
              </Link>
            </div>
          )}
        </div>

        {/* Total amount */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-xl font-bold text-green-600">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;