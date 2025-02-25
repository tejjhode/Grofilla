import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus } from 'lucide-react';
import { removeFromCart, updateQuantity, fetchCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/orderSlice';
import { RootState } from '../store';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((state: RootState) => state.cart); // Ensure items is always an array
  const [userId, setUserId] = useState<string | null>(null);

  // Get userId from local storage
  useEffect(() => {
    const customerData = localStorage.getItem("user");
    try {
      if (customerData) {
        const customer = JSON.parse(customerData);
        setUserId(customer?.id || null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserId(null);
    }
  }, []);

  // Fetch cart when userId is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  // Handlers
  const handleRemoveItem = (productId: string) => {
    if (userId) {
      dispatch(removeFromCart({ userId, productId }));
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (userId && newQuantity > 0) {
      dispatch(updateQuantity({ userId, productId, quantity: newQuantity }));
    }
  };

  const handleCheckout = async () => {
    try {
      if (userId) {
        await dispatch(placeOrder({ userId, items })).unwrap();
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // Calculate total
  const totalAmount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0)
    : 0;

  if (loading) {
    return <div className="text-center py-8">Loading your cart...</div>;
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {Array.isArray(items) ? items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
              >
                <img
                  src={item.product?.imageUrl || ''}
                  alt={item.product?.name || 'Product'}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 ml-6">
                  <h3 className="text-lg font-semibold">{item.product?.name || 'Unnamed Product'}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.product?.category || 'Category'}</p>
                  <p className="text-green-600 font-bold">₹{(item.product?.price || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )) : null}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-gray-600">
                  <span>{item.product?.name} (x{item.quantity})</span>
                  <span>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;