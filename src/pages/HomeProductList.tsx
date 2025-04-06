import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../store/slices/productSlice";
import { RootState, AppDispatch } from "../store";
import { Flame, Sparkles, ShoppingCart, Tag } from "lucide-react";

const HomeProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getRandomProducts = (count: number) => {
    return [...products].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const topSellingProducts = getRandomProducts(5);
  const trendingProducts = getRandomProducts(5);

  const categorizedProducts: { [key: string]: any[] } = {};
  products.forEach((product) => {
    if (!categorizedProducts[product.category]) {
      categorizedProducts[product.category] = [];
    }
    if (categorizedProducts[product.category].length < 6) {
      categorizedProducts[product.category].push(product);
    }
  });

  const renderProductCard = (product: any, badge?: string) => (
    <motion.div
      key={product.id}
      className="relative bg-white/60 backdrop-blur-lg rounded-3xl shadow-md transition transform hover:scale-105 hover:shadow-xl border border-gray-200"
      whileHover={{ scale: 1.05 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-3xl">
          <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
          {badge && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              {badge === "Top" && <Flame size={14} />}
              {badge === "Trending" && <Sparkles size={14} />}
              {badge}
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <h3 className="text-md font-bold text-gray-800 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-bold text-sm">₹{product.price.toFixed(2)}</span>
          <span className="text-gray-400 text-xs">{product.stock} available</span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-md"
        onClick={() => console.log("Add to cart:", product.id)}
      >
        <ShoppingCart size={16} />
      </motion.button>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-xl shadow-lg h-72"
          >
            <div className="h-48 bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4 font-semibold">
        Failed to load products. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
    
      

      {/* 🧨 Top Selling */}
      <section className="mb-14">
        <h2 className="text-3xl font-extrabold text-green-700 text-center flex items-center justify-center gap-2 mb-6">
          <Flame size={28} /> Top Selling
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {topSellingProducts.map((p) => renderProductCard(p, "Top"))}
        </div>
      </section>

      {/* ✨ Trending */}
      <section className="mb-14">
        <h2 className="text-3xl font-extrabold text-blue-600 text-center flex items-center justify-center gap-2 mb-6">
          <Sparkles size={28} /> Trending Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingProducts.map((p) => renderProductCard(p, "Trending"))}
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            !selectedCategory ? "bg-green-700 text-white" : "bg-gray-100 text-gray-800 hover:bg-green-100"
          }`}
        >
          All
        </button>
        {Object.keys(categorizedProducts).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === category
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-green-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 📦 Categorized Products */}
      {Object.entries(categorizedProducts)
        .filter(([category]) => !selectedCategory || selectedCategory === category)
        .map(([category, items]) => (
          <section key={category} className="mb-14">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 flex justify-center items-center gap-2">
              <Tag size={18} /> Best in {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {items.map((product) => renderProductCard(product))}
            </div>
          </section>
        ))}
    </div>
  );
};

export default HomeProductList;