import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart, User, LogOut, MapPin, ClipboardList,
  ShoppingBasket, Info, Search, UserPlus, LogIn,
  Home, LayoutDashboard, X
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

  const [popupOpen, setPopupOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const togglePopup = () => setPopupOpen(!popupOpen);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-2xl">
            <div className="bg-green-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md">
              G
            </div>
            <span className="tracking-tight">Grofila</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-2/5  md:block">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <Info className="w-4 h-4" /> About Us
            </Link>
            <Link to="/products" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <ShoppingBasket className="w-4 h-4" /> Products
            </Link>

            {/* Location Popup */}
            <div className="relative">
              <button onClick={togglePopup} className="flex items-center gap-1 text-green-700 hover:underline">
                <MapPin className="w-4 h-4" />
                <span>Gwalior</span>
              </button>
              {popupOpen && (
                <div className="absolute top-10 right-0 bg-white border rounded-2xl shadow-lg p-4 w-64 z-50">
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

            {/* User Info */}
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
                <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                  <LogIn /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md"
                >
                  <UserPlus /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* BOTTOM NAVBAR (MOBILE) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden">
        <Link to="/" className="flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
          <Home className="w-5 h-5 mb-0.5" /> Home
        </Link>
        <Link to="/products" className="flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
          <ShoppingBasket className="w-5 h-5 mb-0.5" /> Products
        </Link>
        {user?.role === "CUSTOMER" && (
          <>
            <Link to="/cart" className="relative flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
              <ShoppingCart className="w-5 h-5 mb-0.5" />
              Cart
              {items.length > 0 && (
                <span className="absolute top-0 right-1 bg-green-600 text-white rounded-full h-4 w-4 text-[10px] flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <Link to="/orders" className="flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
              <ClipboardList className="w-5 h-5 mb-0.5" />
              Orders
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-red-600 hover:text-red-700" />
            </button>
          </>
        )}
        {user?.role === "SHOPKEEPER" && (
          <>
            <Link to="/dashboard" className="flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              Dashboard
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-red-600 hover:text-red-700" />
            </button>
          </>
        )}
        {!user && (
          <Link to="/login" className="flex flex-col items-center text-xs text-gray-700 hover:text-green-600">
            <LogIn className="w-5 h-5 mb-0.5" />
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;