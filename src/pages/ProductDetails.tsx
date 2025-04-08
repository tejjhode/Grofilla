import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { fetchProductById } from '../store/slices/productSlice';
import { RootState } from '../store';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id, 10)));
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    const customerData = localStorage.getItem("user");
    if (!customerData) return toast.error("Please log in first");

    const customer = JSON.parse(customerData);
    const customerId = customer?.id;
    if (!customerId) return toast.error("Invalid user");

    if (quantity < 1 || quantity > (product?.stock || 0)) {
      toast.error(`Invalid quantity. Available stock: ${product?.stock}`);
      return;
    }

    setIsAdding(true);

    try {
      const newItem = {
        userId: customerId,
        productId: product?.id,
        quantity,
        name: product?.name,
        imageUrl: product?.imageUrl,
        totalPrice: (product?.price || 0) * quantity,
      };

      const response = await fetch("https://tejas.yugal.tech/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add to cart");
      }

      toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Error adding to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg text-center shadow">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-white">
      <div className="rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row bg-white">
        <div className="md:w-1/2 flex justify-center items-center p-6 bg-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-[28rem] w-full object-contain"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between bg-white">
          <div>
            <h1 className="text-4xl font-bold text-zinc-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>
            <p className="text-lg text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
                />
              ))}
              <span className="ml-2 text-gray-500 text-sm">(4.0)</span>
            </div>

            <div className="text-3xl font-bold text-green-600 mb-4">₹{product.price.toFixed(2)}</div>

            <div className="text-sm text-gray-700 mb-6">
              <strong>Availability:</strong>{' '}
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">{product.stock} in stock</span>
              ) : (
                <span className="text-red-500 font-semibold">Out of stock</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {user?.role === 'CUSTOMER' && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={`mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                product.stock === 0 || isAdding
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-b-transparent rounded-full"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;