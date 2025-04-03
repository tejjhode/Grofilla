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

const Cart: React.FC = () => {
  const dispatch = useDispatch<any>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();

  // Get user ID from localStorage safely
  const customerData = localStorage.getItem("user");
  if (!customerData) return rejectWithValue("Customer data not found. Please log in.");

  const customer = JSON.parse(customerData);
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

  // ✅ Calculate Total Cart Price
  const totalCartPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/100"}
                    alt={`Product ${item.productId}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">Product ID: {item.productId}</p>
                    <p className="text-gray-600">₹{item.totalPrice} ({item.quantity}x)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-300 text-black rounded-l"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-300 text-black rounded-r"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ✅ Show Total Price */}
          <div className="mt-6 flex justify-between items-center text-lg font-bold">
            <span>Total Price:</span>
            <span className="text-green-600">₹{totalCartPrice}</span>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-600 text-white rounded mr-4"
              disabled={!userId}
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;