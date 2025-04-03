import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Fetch user details from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    address: "",
  });

  // Calculate total amount from cart
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalAmount(total);
  }, [cartItems]);

  // Estimate delivery time (2-5 days)
  const estimatedDelivery = () => {
    const minMinutes = 10;
    const maxMinutes = 20;
    return `${minMinutes}-${maxMinutes} minutes`;
  };

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_8bR510NJGDF5tL", // Replace with your Razorpay key
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      name: "Grofila Grocery",
      description: "Grocery Order Payment",
      image: "/logo.png",
      handler: function (response: any) {
        alert("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
        navigate("/orders");
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: "#0f9d58" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-40">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* User Information Form */}
      <div className="mb-4">
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter your name"
          value={formData.name}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
          value={formData.email}
          disabled
        />
      </div>

     

      {/* Address */}
      <div className="mb-4">
        <label className="block font-medium">Delivery Address</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter your full address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Phone Number</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          placeholder="Enter your phone number"
          value={formData.phone}
          required
        />
      </div>

      {/* Estimated Delivery Time */}
      <div className="mb-4">
        <p className="text-lg font-semibold">Estimated Delivery Time:</p>
        <p className="text-green-600">{estimatedDelivery()}</p>
      </div>

      {/* Total Amount */}
      <div className="text-lg font-semibold mb-4">
        Total Amount: ₹{totalAmount.toFixed(2)}
      </div>

      {/* Pay Now Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;