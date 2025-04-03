import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import TrackOrder from './pages/TrackOrder';
import OrderDetails from './pages/OrderDetails';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:productId" element={<EditProduct />} /> 
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/" element={<OrderHistory />} />
              <Route path="/order-details/:orderId" element={<OrderDetails />} />
              <Route
                path="/cart"
                element={
                  <PrivateRoute role="CUSTOMER">
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute role="CUSTOMER">
                    <OrderHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/track-order"
                element={
                  <PrivateRoute role="CUSTOMER">
                    <TrackOrder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute role="SHOPKEEPER">
                    <ShopkeeperDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;