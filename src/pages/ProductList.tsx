import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Filter, ArrowDownUp } from 'lucide-react';
import { fetchProducts, fetchShopkeeperProducts } from '../store/slices/productSlice';
import { RootState, AppDispatch } from '../store';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [viewShopkeeperProducts, setViewShopkeeperProducts] = useState(false);

  const userRole = localStorage.getItem('userRole'); // 'shopkeeper' or 'customer'

  const loadProducts = useCallback(() => {
    if (viewShopkeeperProducts) {
      dispatch(fetchShopkeeperProducts());
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, viewShopkeeperProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = [...new Set(products.map(product => product.category))];

  let filteredProducts = products.filter(product => {
    return selectedCategory === '' || product.category === selectedCategory;
  });

  if (selectedSort === 'price-low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSort === 'name-desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg h-60" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-10 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-green-700">Our Products</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-52">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-52">
              <ArrowDownUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sort By</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="p-2 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                    <p className="text-gray-600 text-xs mb-1 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto text-xs">
                    <span className="text-green-600 font-bold">₹{product.price.toFixed(2)}</span>
                    {userRole === 'shopkeeper' && (
                      <span className="text-gray-500">{product.stock} left</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;