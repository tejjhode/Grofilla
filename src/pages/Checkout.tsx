import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/slices/cartSlice";
import axios from "axios";
import { MapPin, Phone, Mail, User } from "lucide-react";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const productState = useSelector((state: RootState) => state.products);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const estimatedDelivery = () => "10-20 minutes";

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrderPlacement = async () => {
    try {
      const shopkeeperId = productState.products.find(
        (product: any) => product.productId === cartItems[0].productId
      )?.shopkeeperId;

      const fullAddress = `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`;

      const orderData = {
        status: "pending",
        customer_id: storedUser.id,
        shopkeeper_id: shopkeeperId,
        orderDate: new Date().toISOString(),
        totalAmount,
        cartItems,
        address: fullAddress,
        phone: formData.phone,
      };

      const response = await axios.post(
        `https://tejas.yugal.tech/orders/place/${storedUser.id}/16`,
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        await axios.delete(`https://tejas.yugal.tech/api/cart/user/16/clear`);
        dispatch(clearCart());
        navigate("/orders");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_8bR510NJGDF5tL",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Grofila Grocery",
      description: "Grocery Order Payment",
      image: "/logo.png",
      handler: function (response: any) {
        alert("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
        handleOrderPlacement();
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#0f9d58" },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Address Section */}
      <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-sm mb-1 flex items-center gap-1">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1 flex items-center gap-1">
            <Phone className="w-4 h-4" /> Phone Number
          </label>
          <input
            type="tel"
            className="w-full p-2 border rounded"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
          />
        </div>

        <div className="text-sm text-gray-500">
          Estimated Delivery Time: <span className="text-green-600 font-medium">{estimatedDelivery()}</span>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Order Summary</h3>

        <ul className="divide-y">
          {cartItems.map((item) => (
            <li key={item.productId} className="py-2 text-sm">
              <div className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium">₹{item.totalPrice.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t pt-2 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            " Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;