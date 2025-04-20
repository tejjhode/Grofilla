import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchProductById } from '../store/slices/productSlice';
import { RootState } from '../store';
import {
  ShoppingCart, Star, Plus, Minus, Tag, FileText, Truck, Repeat2, User
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

const dummyReviews: Review[] = [
  { id: 1, name: "Aarav", rating: 5, comment: "Excellent quality and fast delivery!" },
  { id: 2, name: "Priya", rating: 4, comment: "Product is good, just a bit pricey." },
  { id: 3, name: "Rohan", rating: 3, comment: "Average experience. Expected more." }
];

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([...dummyReviews]);

  useEffect(() => {
    if (id) dispatch(fetchProductById(parseInt(id, 10)));
  }, [dispatch, id]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!id) return;
      setRecommendationsLoading(true);
      try {
        const { data } = await axios.post('https://grofillaml.tejaswa.tech/recommendations/', {
          product_id: id,
          top_n: 10,
        });
        setRecommendations(data.recommendations || []);
      } catch (error) {
        toast.error('Error loading recommendations');
      } finally {
        setRecommendationsLoading(false);
      }
    };
    loadRecommendations();
  }, [id]);

  const handleAddToCart = async () => {
    const customerData = localStorage.getItem("user");
    if (!customerData) return toast.error("Please log in first");
    const customer = JSON.parse(customerData);
    const customerId = customer?.id;
    if (!customerId) return toast.error("Invalid user");
    if (quantity < 1 || quantity > (product?.stock || 0)) return toast.error(`Invalid quantity. Stock: ${product?.stock}`);

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
      if (!response.ok) throw new Error("Failed to add to cart");
      toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = () => {
    if (!userRating || !userComment) return toast.error("Please add rating and comment");
    const newReview: Review = {
      id: submittedReviews.length + 1,
      name: user?.name || "Anonymous",
      rating: userRating,
      comment: userComment,
    };
    setSubmittedReviews([newReview, ...submittedReviews]);
    setUserRating(0);
    setUserComment('');
    toast.success("Review submitted!");
  };

  const renderStars = (count: number) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div></div>;

  if (error || !product) return <div className="text-center mt-20 text-red-600">{error || 'Product not found'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 mt-4">
        <img src={product.imageUrl} alt={product.name} className="w-full max-h-[32rem] object-contain rounded-xl shadow" />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-zinc-800">{product.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2"><Tag size={16} />{product.category}</p>
          <p className="text-gray-700 text-base flex gap-2"><FileText size={18} />{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><Truck size={16} />Free Delivery</span>
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><Repeat2 size={16} />10 Days Return</span>
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"><User size={16} />Trusted Seller</span>
          </div>

          <p className="text-xl font-semibold text-green-600 mt-4">₹{product.price}</p>
          <div className="flex items-center gap-3">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-100 hover:bg-gray-200"><Minus size={18} /></button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-1 bg-gray-100 hover:bg-gray-200"><Plus size={18} /></button>
            </div>
          </div>

          {user?.role === 'CUSTOMER' && (
            <button onClick={handleAddToCart} disabled={product.stock === 0 || isAdding} className={`mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all ${product.stock === 0 || isAdding ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              {isAdding ? <><div className="animate-spin h-5 w-5 border-2 border-white border-b-transparent rounded-full"></div>Adding...</> : <><ShoppingCart className="w-5 h-5" />Add to Cart</>}
            </button>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendationsLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : (
            recommendations.map(item => (
              <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="cursor-pointer border rounded-xl shadow hover:shadow-lg transition bg-white p-3">
                <img src={item.imageUrl} alt={item.name} className="h-36 object-contain w-full rounded" />
                <h3 className="text-sm font-semibold mt-2 truncate">{item.name}</h3>
                <p className="text-xs text-gray-600 truncate">{item.description}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="text-sm font-bold text-green-600">₹{item.price}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reviews & Ratings */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

        {/* Submit Review */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="mb-2 font-medium">Leave a Review:</p>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                onClick={() => setUserRating(i)}
                className={`cursor-pointer w-6 h-6 ${i <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <textarea
            rows={3}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            placeholder="Write your review here..."
          />
          <button onClick={handleReviewSubmit} className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Submit Review
          </button>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {submittedReviews.map(r => (
            <div key={r.id} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{r.name}</span>
                <div className="flex gap-1">{renderStars(r.rating)}</div>
              </div>
              <p className="text-gray-700 text-sm mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;