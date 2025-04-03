import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-green-600 flex items-center justify-center gap-2">
          <FaShoppingCart size={35} /> Your Cart
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-5 inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md"
              >
                {/* Product Image */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                {/* Product Details */}
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-500">₹{item.product.price.toFixed(2)}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-lg hover:bg-gray-400 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-white border text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-lg hover:bg-gray-400 transition"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="ml-6 text-red-500 hover:text-red-700 transition"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Total & Checkout */}
          <div className="mt-8 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Total: ₹{totalPrice.toFixed(2)}
            </h3>
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;