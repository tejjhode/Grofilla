import React, { useState } from "react";
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-green-600 font-extrabold text-2xl">
            <div className="bg-green-600 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center text-lg font-bold shadow-sm">
              G
            </div>
            <span className="tracking-tight font-poppins">Grofilla</span>
          </Link>

          {/* Search Input */}
          <div className="relative w-1/2  md:block">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchTerm && (
              <div className="absolute bg-white border border-gray-300 rounded-lg mt-2 shadow-lg w-full max-h-64 overflow-auto z-50">
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

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6 font-medium">
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">About Us</Link>

            <div className="flex items-center gap-1 text-gray-700">
            <button
              onClick={togglePopup}
              className="flex items-center gap-1 text-green-700 font-medium hover:underline"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Gwalior</span>
            </button>
            </div>
            {popupOpen && (
          <div className="absolute mt-28 bg-white border rounded-2xl shadow-md p-4 w-64 z-50">
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
                    <Link to="/cart" className="relative text-gray-700 hover:text-green-600 transition">
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
         
          {/* Mobile menu button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/about" className="block text-gray-700 hover:text-green-600">About Us</Link>
            {/* <div className="flex items-center gap-1 text-gray-700">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Gwalior</span>
            </div> */}
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <>
                    {/* <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                      <ShoppingCart className="h-5 w-5" /> Cart
                    </Link> */}
                    <Link to="/orders" className="block text-gray-700 hover:text-green-600">Orders</Link>
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