import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  MapPin,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import { setSearchTerm } from "../store/slices/productSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const { products, searchTerm } = useSelector((state: RootState) => state.products);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCityPopup, setShowCityPopup] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCityPopup = () => {
    setShowCityPopup(!showCityPopup);
    setTimeout(() => setShowCityPopup(false), 3000);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-green-600 font-extrabold text-2xl tracking-wide">
          <div className="bg-green-100 p-2 rounded-full shadow-sm">🥦</div>
          <span className="font-extrabold">Grofilla</span>
        </Link>

        {/* Search */}
        <div className="hidden sm:flex flex-col w-full max-w-md relative">
          <input
            type="text"
            placeholder="Search for groceries..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-green-500"
          />
          <Search className="absolute right-4 top-3 text-gray-500 h-5 w-5" />
          {searchTerm && (
            <div className="absolute bg-white shadow-lg w-full mt-1 rounded-lg max-h-60 overflow-auto z-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      dispatch(setSearchTerm(""));
                    }}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">No products found</p>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Cart Always Visible */}
          {user?.role === "CUSTOMER" && (
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800 sm:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & City Below */}
      <div className="block sm:hidden px-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for groceries..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-green-500"
          />
          <Search className="absolute right-4 top-3 text-gray-500 h-5 w-5" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-5 w-5 text-green-600" />
          <button onClick={toggleCityPopup} className="text-left font-medium">
            Gwalior
          </button>
        </div>
      </div>

      {/* City Popup */}
      {showCityPopup && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg px-4 py-2 rounded-lg z-50 w-[90%] sm:w-[300px]">
          <h4 className="text-sm font-bold text-green-600 mb-1">Delivery in 19 minutes</h4>
          <p className="text-gray-600 text-xs">Gwalior, Madhya Pradesh, India</p>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md rounded-b-lg px-6 py-4 space-y-3 mt-3">
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600">
            Products
          </Link>

          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600">
            About Us
          </Link>

          {user ? (
            <>
              {user.role === "CUSTOMER" && (
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600">
                  Orders
                </Link>
              )}
              {user.role === "SHOPKEEPER" && (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600">
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-700" />
                <span className="text-gray-700">{user.name}</span>
                <button onClick={handleLogout}>
                  <LogOut className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-green-600">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;