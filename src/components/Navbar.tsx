import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  MapPin,
  ClipboardList,
  ShoppingBasket,
  Info,
  Search
  
} from "lucide-react";
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
  const [popupOpen, setPopupOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-green-600 font-extrabold text-2xl">
            <div className="bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow">
              G
            </div>
            <span className="font-poppins tracking-tight">Grofilla</span>
          </Link>

          {/* Search */}
          <div className="relative w-1/3 hidden md:block">
  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
  <input
    type="text"
    placeholder="Search groceries..."
    value={searchTerm}
    onChange={handleSearch}
    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none transition"
  />
  {searchTerm && (
    <div className="absolute bg-white border rounded-lg mt-2 shadow-lg w-full max-h-64 overflow-auto z-50">
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <Info /> About Us
            </Link>
            <Link to="/products" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <ShoppingBasket /> All Products
            </Link>

            {/* Location Popup */}
            <div className="relative">
              <button
                onClick={togglePopup}
                className="flex items-center gap-1 text-green-700 hover:underline"
              >
                <MapPin className="w-4 h-4" />
                <span>Gwalior</span>
              </button>
              {popupOpen && (
                <div className="absolute top-10 right-0 bg-white border rounded-2xl shadow p-4 w-64 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-green-700">Delivery in 19 minutes</h3>
                    <button onClick={togglePopup}>
                      <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Gwalior, Madhya Pradesh, India</p>
                </div>
              )}
            </div>

            {/* User Section */}
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-green-600 transition">
                      <ShoppingCart className="h-6 w-6" />
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {items.length}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                      <ClipboardList className="h-5 w-5" /> My Orders
                    </Link>
                  </>
                )}
                {user.role === "SHOPKEEPER" && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span>{user.name}</span>
                  <button onClick={handleLogout}>
                    <LogOut className="w-5 h-5 text-red-600 hover:text-red-700" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 text-sm">
            <Link to="/about" className="block text-gray-700 hover:text-green-600">About Us</Link>
            <Link to="/products" className="block text-gray-700 hover:text-green-600">Products</Link>
            <div className="flex items-center gap-1 text-gray-700">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Gwalior</span>
            </div>
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                    <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                      <ShoppingCart className="h-5 w-5" /> Cart
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                      <ClipboardList className="h-5 w-5" /> Orders
                    </Link>
                  </>
                )}
                {user.role === "SHOPKEEPER" && (
                  <Link to="/dashboard" className="block text-gray-700 hover:text-green-600">Dashboard</Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-700" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Logout</span>
                  <button onClick={handleLogout}>
                    <LogOut className="w-5 h-5 text-red-600 hover:text-red-700" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-green-600">Login</Link>
                <Link to="/register" className="block bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;