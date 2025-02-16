import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star } from 'lucide-react';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id, 10))); // Ensure id is a number
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("You need to log in to add items to your cart.");
      return;
    }
    console.log("Adding product to cart:", product); // Debugging log
    console.log("User:", user.id);
    const userId = user.id; // Debugging log
  
    if (product) {
      dispatch(addToCart({user, product, quantity: 1 })); // ✅ Correct structure
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-96 w-full object-cover md:w-96"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{product.category}</p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₹{product.price.toFixed(2)}
              </div>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"}`} />
              ))}
              <span className="ml-2 text-gray-600">(4.0)</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-700">
                <span className="font-semibold">Availability: </span>
                {product.stock > 0 ? (
                  <span className="text-green-600">{product.stock} in stock</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </div>
            </div>

            {user?.role === 'CUSTOMER' && (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-colors ${
                  product.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;