import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, LogOut, Menu, X, MapPin } from "lucide-react";
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-green-700 tracking-wide">
            <span className="bg-green-100 px-2 py-1 rounded-xl">Grofilla</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-4 w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-green-500"
            />
            {/* Location */}
            <button
              onClick={togglePopup}
              className="flex items-center gap-1 text-green-700 font-medium hover:underline"
            >
              <MapPin className="h-4 w-4" />
              <span>Gwalior</span>
            </button>
            {popupOpen && (
              <div className="absolute top-20 right-1/3 bg-white border rounded-lg shadow-md p-4 w-64 z-50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-green-700">Delivery in 19 minutes</h3>
                  <button onClick={togglePopup}><X className="h-4 w-4 text-gray-600" /></button>
                </div>
                <p className="text-sm text-gray-600">Gwalior, Madhya Pradesh, India</p>
              </div>
            )}
          </div>

          {/* Right - Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                      <ShoppingCart className="h-6 w-6" />
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {items.length}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="text-gray-700 hover:text-green-600">Orders</Link>
                  </>
                )}
                {user.role === "SHOPKEEPER" && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 w-full p-4 space-y-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-green-500"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={togglePopup}
                className="flex items-center gap-1 text-green-700 font-medium hover:underline"
              >
                <MapPin className="h-4 w-4" />
                <span>Gwalior</span>
              </button>
              <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
            </div>
            {popupOpen && (
              <div className="bg-white border rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-green-700">Delivery in 19 minutes</h3>
                  <button onClick={togglePopup}><X className="h-4 w-4 text-gray-600" /></button>
                </div>
                <p className="text-sm text-gray-600">Gwalior, Madhya Pradesh, India</p>
              </div>
            )}
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                    <Link to="/cart" className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" /> Cart
                    </Link>
                    <Link to="/orders">Orders</Link>
                  </>
                )}
                {user.role === "SHOPKEEPER" && (
                  <Link to="/dashboard">Dashboard</Link>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                  <button onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
