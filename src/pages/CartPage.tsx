import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  fetchCartItems,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const Cart: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const customerData = localStorage.getItem("user");
  const customer = customerData ? JSON.parse(customerData) : null;
  const userId = customer?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleQuantityChange = (cartId: number, quantity: number) => {
    if (quantity >= 1) {
      dispatch(updateCartItem({ cartId, quantity }));
    }
  };

  const handleRemove = (cartId: number) => {
    dispatch(removeFromCart(cartId));
  };

  const handleClearCart = () => {
    if (userId) {
      dispatch(clearCart(userId));
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const shippingCharge = subtotal > 0 && subtotal < 500 ? 50 : 0;
  const grandTotal = subtotal + shippingCharge;
  const remainingForFreeShipping = subtotal < 500 ? 500 - subtotal : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 flex items-center justify-center gap-3">
        <FaShoppingCart className="text-green-500" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl mb-4">🛒 Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-xl shadow-md transition hover:shadow-lg"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/100"}
                    alt={`Product ${item.productId}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-500">
                      ₹{item.totalPrice} ({item.quantity}x)
                    </p>
                  </div>
                </div>

                <div className="flex items-center mt-4 sm:mt-0 gap-4">
                  <button
                    className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4">Order Summary</h3>

            <div className="space-y-2 text-gray-700 text-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className={shippingCharge ? "text-red-500" : "text-green-600"}>
                  {shippingCharge ? `₹${shippingCharge}` : "Free"}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Free shipping progress */}
            {remainingForFreeShipping > 0 && (
              <div className="text-sm text-gray-600">
                <p>
                  Add ₹{remainingForFreeShipping.toFixed(2)} more for{" "}
                  <span className="text-green-600 font-medium">Free Shipping</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={handleClearCart}
                disabled={!userId}
                className="w-full py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;