import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, LogOut, Menu, X, Search } from "lucide-react";
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

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            Grofila
          </Link>

          {/* Search Box - Always Visible */}
          <div className="relative w-1/2 sm:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none"
            />
            <Search className="absolute right-3 top-2 text-gray-500 h-5 w-5" />
            {searchTerm && (
              <div className="absolute bg-white shadow-lg w-full mt-1 rounded-lg max-h-60 overflow-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate(`/products/${product.id}`);
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
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-green-600">
              Products
            </Link>

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
                    <Link to="/orders" className="text-gray-700 hover:text-green-600">
                      Orders
                    </Link>
                  </>
                )}
                {user.role === "SHOPKEEPER" && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-green-600">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700 focus:outline-none">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - Collapsible */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg absolute w-full left-0 top-16">
            <div className="flex flex-col p-4 space-y-3">
              <Link to="/products" className="text-gray-700 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                Products
              </Link>

              {user ? (
                <>
                  {user.role === "CUSTOMER" && (
                    <>
                      <Link to="/cart" className="relative text-gray-700 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingCart className="h-6 w-6 inline" /> Cart
                        {items.length > 0 && (
                          <span className="ml-2 bg-green-600 text-white rounded-full h-5 w-5 inline-flex items-center justify-center text-xs">
                            {items.length}
                          </span>
                        )}
                      </Link>
                      <Link to="/orders" className="text-gray-700 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                        Orders
                      </Link>
                    </>
                  )}
                  {user.role === "SHOPKEEPER" && (
                    <Link to="/dashboard" className="text-gray-700 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  )}

                  <div className="flex items-center space-x-4 mt-3">
                    <User className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-700">{user.name}</span>
                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" className="text-gray-700 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;