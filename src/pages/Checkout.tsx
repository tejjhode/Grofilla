import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/slices/cartSlice";
import axios from "axios";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const productState = useSelector((state: RootState) => state.products);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: "",
    address: "",
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

      const orderData = {
        status: "pending",
        customer_id: storedUser.id,
        shopkeeper_id: shopkeeperId,
        orderDate: new Date().toISOString(),
        totalAmount,
        cartItems, // Send product info too (optional)
        address: formData.address,
        phone: formData.phone,
      };
      console.log(storedUser.id)

      const response = await axios.post(
        `https://tejas.yugal.tech/orders/place/${storedUser.id}/16`,
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        await axios.delete(`https://tejas.yugal.tech/api/cart/user/16/clear`);
        navigate("/orders");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong while placing your order.");
    }
  };

  const handlePayment = async () => {
    if (!formData.address || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_8bR510NJGDF5tL", // Replace with your live key in production
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
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-40">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="mb-4">
        <label className="block font-medium">Full Name</label>
        <input type="text" className="w-full p-2 border rounded" value={formData.name} disabled />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Email</label>
        <input type="email" className="w-full p-2 border rounded" value={formData.email} disabled />
      </div>

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
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold">Estimated Delivery Time:</p>
        <p className="text-green-600">{estimatedDelivery()}</p>
      </div>

      <div className="text-lg font-semibold mb-4">
        Total Amount: ₹{totalAmount.toFixed(2)}
      </div>

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