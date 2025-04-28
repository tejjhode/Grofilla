import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../store/slices/productSlice";
import { RootState, AppDispatch } from "../store";
import { Flame, Sparkles, Tag } from "lucide-react";

const HomeProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    categorizedProducts[product.category].push(product);
  });

  const renderProductCard = (product: any, badge?: string) => (
    <motion.div
      key={product.id}
      className="relative bg-white/60 backdrop-blur-lg rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-xl border border-gray-200"
      whileHover={{ scale: 1.05 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-xl h-36 sm:h-44 md:h-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {badge && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              {badge === "Top" && <Flame size={14} />}
              {badge === "Trending" && <Sparkles size={14} />}
              {badge}
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
        <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-bold">₹{product.price.toFixed(2)}</span>
          {user?.role === "shopkeeper" && (
            <span className="text-gray-400 text-xs">{product.stock} in stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-64">
            <div className="h-36 bg-gray-200 rounded-t-xl" />
            <div className="p-3 space-y-2">
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
    <div className="container mx-auto px-2 sm:px-4 py-10">
      {/* Top Selling Section */}
      <section className="mb-14">
        <h2 className="text-xl sm:text-3xl font-extrabold text-green-700 text-center flex items-center justify-center gap-2 mb-6">
          <Flame size={24} /> Top Selling
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {topSellingProducts.map((p) => renderProductCard(p, "Top"))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="mb-14">
        <h2 className="text-xl sm:text-3xl font-extrabold text-blue-600 text-center flex items-center justify-center gap-2 mb-6">
          <Sparkles size={24} /> Trending Now
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {trendingProducts.map((p) => renderProductCard(p, "Trending"))}
        </div>
      </section>

      {/* Category Buttons */}
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

      {/* Products by Category */}
      {Object.entries(categorizedProducts)
        .filter(([category]) => !selectedCategory || selectedCategory === category)
        .map(([category, items]) => (
          <section key={category} className="mb-14">
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6 flex justify-center items-center gap-2">
              <Tag size={18} /> Best in {category}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {items.slice(0, isMobile ? 6 : 5).map((product) => renderProductCard(product))}
            </div>
          </section>
        ))}
    </div>
  );
};

export default HomeProductList;