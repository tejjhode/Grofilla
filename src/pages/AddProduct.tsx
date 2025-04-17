import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { addProduct } from "../store/slices/productSlice"; // Import action
import { useNavigate } from "react-router-dom";


const AddProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useSelector((state: RootState) => state.products);
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
  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock.toString(),
          imageUrl: product.imageUrl,
        });
      }
    }
  }, [id, products]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [productId, setProductId] = useState<number | null>(null); // To store the new product's ID

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newProduct = { ...productData, id: Date.now() }; // Simulating the addition of a product (you should replace this with your actual API call)
      dispatch(addProduct(newProduct)); 
      
      setLoading(false);
      setSuccess(true);
      setProductId(newProduct.id); // Save the ID of the new product

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 2000); // Simulating API delay
  };

  const handleRedirect = () => {
    if (productId) {
      navigate(`/product/${productId}`); // Redirect to the new product's details page
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 mt-6">Add New Product</h1>

      {success && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Product Added Successfully!</h2>
            <p className="text-lg mb-4">Your product has been successfully added to the inventory.</p>
            <button
              onClick={handleRedirect}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Go to Product Page
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-lg p-6">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-gray-700">Product Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Enter product name" 
            value={productData.name} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
          <textarea 
            id="description" 
            name="description" 
            placeholder="Enter product description" 
            value={productData.description} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-lg font-semibold text-gray-700">Price</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            placeholder="Enter product price" 
            value={productData.price} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-lg font-semibold text-gray-700">Stock Quantity</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            placeholder="Enter stock quantity" 
            value={productData.stock} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Category</label>
          <input 
            type="text" 
            id="category" 
            name="category" 
            placeholder="Enter product category" 
            value={productData.category} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-lg font-semibold text-gray-700">Image URL</label>
          <input 
            type="text" 
            id="imageUrl" 
            name="imageUrl" 
            placeholder="Enter product image URL" 
            value={productData.imageUrl} 
            onChange={handleChange} 
            required 
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;