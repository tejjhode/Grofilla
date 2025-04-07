import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, LogOut, Menu, X, MapPin } from "lucide-react";
import { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import { setSearchTerm } from "../store/slices/productSlice";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-700 tracking-wide">
            <span className="bg-green-100 px-2 py-1 rounded-xl">Grofilla</span>
          </Link>

          {/* Mobile Menu Toggle */}
         

          {/* Location & Cart */}
          <div className="flex items-center gap-4">
           <div>
           <button
              onClick={togglePopup}
              className="flex items-center gap-1 text-green-700 font-medium hover:underline"
            >
              <MapPin className="h-4 w-4" />
              <span className="">Gwalior</span>
            </button>
           </div>
           <div>

           </div>
            <div>
            {user && user.role === "CUSTOMER" && (
              <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            </div>
           
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search bar for all devices */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-green-500"
          />
        </div>

        {/* Location Popup */}
        {popupOpen && (
          <div className="absolute mt-2 bg-white border rounded-lg shadow-md p-4 w-64 z-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-green-700">Delivery in 19 minutes</h3>
              <button onClick={togglePopup}><X className="h-4 w-4 text-gray-600" /></button>
            </div>
            <p className="text-sm text-gray-600">Gwalior, Madhya Pradesh, India</p>
          </div>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
  {isMobileMenuOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Side Drawer */}
      <motion.div
        className="fixed top-0 right-0 h-full w-1/2 bg-white z-50 p-6 shadow-lg flex flex-col space-y-4"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween" }}
      >
        <div className="flex justify-end">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
        {user ? (
          <>
            {user.role === "CUSTOMER" && <Link to="/orders">Orders</Link>}
            {user.role === "SHOPKEEPER" && <Link to="/dashboard">Dashboard</Link>}
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-700" />
              <span className="text-gray-700">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:underline">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
            <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Register</Link>
          </>
        )}
      </motion.div>
    </>
  )}
</AnimatePresence>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end items-center space-x-6 mt-2">
          <Link to="/about" className="text-gray-700 hover:text-green-600">About Us</Link>
          {user ? (
            <>
              {user.role === "CUSTOMER" && <Link to="/orders">Orders</Link>}
              {user.role === "SHOPKEEPER" && <Link to="/dashboard">Dashboard</Link>}
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
      </div>
    </nav>
  );
};

export default Navbar;
