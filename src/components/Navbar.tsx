import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, MapPin } from 'lucide-react';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Grofila
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-green-600">
              Products
            </Link>
            
            {user ? (
              <>
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link to="/cart" className="text-gray-700 hover:text-green-600 relative">
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
                    <Link to="/track-order" className="text-gray-700 hover:text-green-600 flex items-center">
                      <MapPin className="h-5 w-5 mr-1" />
                      Track Order
                    </Link>
                  </>
                )}
                
                {user.role === 'SHOPKEEPER' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
                    Dashboard
                  </Link>
                )}
                
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;