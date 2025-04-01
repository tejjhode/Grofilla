import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../store/slices/productSlice";
import { RootState, AppDispatch } from "../store";

const HomeProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Get Random Products for Top Sections
  const getRandomProducts = (count: number) => {
    return [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  const topSellingProducts = getRandomProducts(5);
  const trendingProducts = getRandomProducts(5);

  // Categorize Products (Max 6 per category)
  const categorizedProducts: { [key: string]: any[] } = {};
  products.forEach((product) => {
    if (!categorizedProducts[product.category]) {
      categorizedProducts[product.category] = [];
    }
    if (categorizedProducts[product.category].length < 6) {
      categorizedProducts[product.category].push(product);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔹 Top Selling Products */}
      <section className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-green-600 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🔥 Top Selling Products
        </motion.h2>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 flex-wrap justify-center">
            {topSellingProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl max-w-xs w-full"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-44 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-green-600 font-bold">₹{product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Trending Products */}
      <section className="mb-12">
        <motion.h2
          className="text-3xl font-bold text-blue-600 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚀 Trending Products
        </motion.h2>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 flex-wrap justify-center">
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl max-w-xs w-full"
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-44 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-green-600 font-bold">₹{product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Products By Category */}
      {Object.entries(categorizedProducts).map(([category, items]) => (
        <div key={category} className="mb-12">
          <motion.h2
            className="text-2xl font-semibold mb-6 text-green-700 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {category}
          </motion.h2>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 flex-wrap justify-center">
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl max-w-xs w-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">₹{product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{product.stock} in stock</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeProductList;