import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart, Star, Plus, Minus, Truck, Repeat2, Tag, FileText, Type, User
} from 'lucide-react';
import { fetchProductById } from '../store/slices/productSlice';
import { RootState } from '../store';
import toast from 'react-hot-toast';

const reviews = [
  { name: "Rahul Sharma", stars: 5, text: "Great quality, loved it!" },
  { name: "Priya Verma", stars: 4, text: "Delivered quickly and fresh." },
  { name: "Amit Yadav", stars: 3, text: "Decent, but could be better." },
  { name: "Sneha Gupta", stars: 5, text: "Perfect product, value for money." },
];

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    if (id) dispatch(fetchProductById(parseInt(id, 10)));
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

  const handleReviewSubmit = () => {
    if (!reviewText || userRating === 0) {
      toast.error("Please provide both a rating and review.");
      return;
    }

    toast.success("Review submitted!");
    setReviewText("");
    setUserRating(0);
    // Backend API for posting review can be added here
  };

  const renderStars = (count: number) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));

  if (loading)
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

  if (error || !product)
    return <div className="text-center mt-20 text-red-600">{error || 'Product not found'}</div>;

  const isDairyFruitOrFood = ['dairy', 'fruits', 'food'].includes(product.category.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      {/* Product Card */}
      <div className="rounded-xl shadow-xl flex flex-col md:flex-row bg-white mb-10 gap-4">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center p-6">
          <img src={product.imageUrl} alt={product.name} className="h-[26rem] w-full object-contain" />
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-zinc-800 flex items-center gap-2">
           {product.name}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            {product.category}
          </p>
          <p className="text-base text-gray-700 flex items-start gap-2">
            <FileText size={18} className="text-gray-700 mt-1" />
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-4">
            <span className="font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                <Minus size={18} />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          {user?.role === 'CUSTOMER' && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={`mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
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

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-4 text-sm font-medium mb-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
          <Truck size={16} className="text-green-600" />
          Free Delivery above ₹299
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
          <Repeat2 size={16} className="text-yellow-600" />
          {isDairyFruitOrFood ? "1 Day Return & Replacement" : "7 Days Return & Replacement"}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
          <Tag size={16} className="text-blue-600" />
          Fast Delivery
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-6 border-t pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Customer Reviews</h2>

        <div className="flex justify-center mb-6">
          <span className="text-yellow-500 text-3xl font-bold">4.0</span>
          <div className="ml-2 flex">{renderStars(4)}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-gray-600" />
                <span className="font-medium text-gray-800">{review.name}</span>
              </div>
              <div className="flex mb-2">{renderStars(review.stars)}</div>
              <p className="text-gray-600 text-sm">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Write Review */}
        <div className="mt-10 text-center">
          <h3 className="text-lg font-semibold mb-2">Write your review:</h3>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => setUserRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <textarea
            className="w-full max-w-xl border rounded-md p-3 text-sm text-gray-700"
            rows={3}
            placeholder="Write your feedback here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button
            onClick={handleReviewSubmit}
            className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;