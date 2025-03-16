import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../store/slices/productSlice"; // Import action
import { useNavigate } from "react-router-dom";

const AddProduct: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      dispatch(addProduct(productData)); 
      setLoading(false);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

      // Redirect after success
      setTimeout(() => navigate("/"), 3000);
    }, 2000); // Simulating API delay
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      {success && <p className="text-green-600 font-semibold mb-4">Product added successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" value={productData.description} onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
        <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="number" name="stock" placeholder="Stock Quantity" value={productData.stock} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="category" placeholder="Category" value={productData.category} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="imageUrl" placeholder="Image URL" value={productData.imageUrl} onChange={handleChange} required className="w-full p-2 border rounded" />
        
        <button type="submit" disabled={loading} className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-500"}`}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;