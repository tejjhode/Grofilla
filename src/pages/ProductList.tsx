import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, Edit } from 'lucide-react';
import { fetchProducts, fetchShopkeeperProducts } from '../store/slices/productSlice';
import { RootState, AppDispatch } from '../store';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewShopkeeperProducts, setViewShopkeeperProducts] = useState(false);

  // Use useCallback to ensure proper dependency handling in useEffect
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

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">{viewShopkeeperProducts ? 'My Products' : 'Our Products'}</h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Shopkeeper Products & Add Button */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setViewShopkeeperProducts(!viewShopkeeperProducts)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            {viewShopkeeperProducts ? 'View All Products' : 'View My Products'}
          </button>
          {viewShopkeeperProducts && (
            <Link to="/add-product" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center">
              <PlusCircle className="mr-2" /> Add New Product
            </Link>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
              <Link to={`/product/${product.id}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">₹{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{product.stock} in stock</span>
                </div>
              </div>

              {/* Edit Button for Shopkeepers */}
              {viewShopkeeperProducts && (
                <Link to={`/edit-product/${product.id}`} className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition">
                  <Edit size={16} />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;