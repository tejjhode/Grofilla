import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { promoCodes, PromoCode } from "../coupons/promotion_codes";

const Cart: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isPaying, setIsPaying] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState("");

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
      setAppliedPromo(null);
      setPromoMessage("");
    }
  };

  const handleProceedToPay = () => {
    setIsPaying(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 2000);
  };

  const mergedCartItems = Object.values(
    cartItems.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = { ...item };
      } else {
        acc[item.productId].quantity += item.quantity;
        acc[item.productId].totalPrice += item.totalPrice;
      }
      return acc;
    }, {} as Record<number, typeof cartItems[0]>)
  );

  const subtotal = mergedCartItems.reduce((total, item) => total + item.totalPrice, 0);
  const shippingCharge = subtotal > 0 && subtotal < 299 ? 50 : 0;

  // Apply Promo Code Logic
  let discount = 0;
  if (appliedPromo && subtotal >= appliedPromo.minOrderValue) {
    if (appliedPromo.type === "flat") {
      discount = appliedPromo.value;
    } else {
      discount = (appliedPromo.value / 100) * subtotal;
      if (appliedPromo.maxDiscount && discount > appliedPromo.maxDiscount) {
        discount = appliedPromo.maxDiscount;
      }
    }
  }

  const grandTotal = subtotal - discount + shippingCharge;
  const remainingForFreeShipping = subtotal < 299 ? 299 - subtotal : 0;

  const handleApplyPromo = () => {
    const found = promoCodes.find(p => p.code === promoCodeInput.toUpperCase());
    if (!found) {
      setPromoMessage("❌ Invalid promo code.");
      return;
    }
    if (subtotal < found.minOrderValue) {
      setPromoMessage(`❌ Minimum order ₹${found.minOrderValue} required for this promo.`);
      return;
    }
    setAppliedPromo(found);
    setPromoMessage(`✅ Promo ${found.code} applied!`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoMessage("Promo code removed.");
  };

  const suggestedPromos = promoCodes
    .filter(p => subtotal >= p.minOrderValue && p.code !== appliedPromo?.code)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center gap-3">
        <FaShoppingCart className="text-green-600" /> Shopping Cart
      </h1>

      {mergedCartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-2xl mb-4">🛒 Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {mergedCartItems.map((item) => (
              <motion.div
                key={item.productId}
                className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="flex items-center gap-4 w-full sm:w-auto cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/100"}
                    alt={`Product ${item.productId}`}
                    className="w-24 h-24 object-cover rounded-lg transition-all hover:scale-105"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600">
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
              </motion.div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4">Order Summary</h3>

            <div className="space-y-2 text-gray-700 text-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({appliedPromo.code}):</span>
                  <span>− ₹{discount.toFixed(2)}</span>
                </div>
              )}
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

            {/* Promo Code UI */}
            <div className="pt-4 space-y-2">
              <div className="flex gap-2">
                <input
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  type="text"
                  placeholder="Enter Promo Code"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <div className={`text-sm ${promoMessage.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
                  {promoMessage}
                </div>
              )}
              {appliedPromo && (
                <div className="text-sm">
                  <span className="font-semibold">Applied Promo: {appliedPromo.code}</span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-500 ml-2 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Suggested Promo Codes */}
<div className="pt-6 space-y-2 text-sm text-gray-700">
  {suggestedPromos.length > 0 && (
    <div>
      <h4 className="font-semibold">Top Discounted Promo Codes</h4>
      {suggestedPromos
        .sort((a, b) => (b.value - a.value)) // Sorting by discount value (descending)
        .map((promo) => (
          <motion.div
            key={promo.code}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{promo.code}</span>
              <span className="text-sm text-gray-600">{promo.description}</span>
            </div>
            <button
              onClick={() => setPromoCodeInput(promo.code)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Apply
            </button>
          </motion.div>
        ))}
    </div>
  )}
</div>

            {/* Proceed to Pay Button */}
            <button
              onClick={handleProceedToPay}
              disabled={isPaying}
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 disabled:bg-gray-400 hover:bg-green-700 transition"
            >
              {isPaying ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;