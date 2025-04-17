import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: 'CUSTOMER' | 'SHOPKEEPER';
  }>({
    email: '',
    password: '',
    role: 'CUSTOMER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'role' ? (value as 'CUSTOMER' | 'SHOPKEEPER') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(formData)).unwrap();
      if (response && response.id) {
        navigate('/');
      } else {
        alert("Login failed: Invalid response from server.");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-6 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <LogIn className="h-12 w-12 text-green-600" />
          <h2 className="text-3xl font-extrabold text-gray-900">Sign in to Grofila</h2>
          <p className="text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="text-green-600 hover:underline font-medium">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
    Password
  </label>
  <div className="relative">
    <input
      id="password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      value={formData.password}
      onChange={handleChange}
      className="mt-1 w-full px-4 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
      placeholder="Enter your password"
    />
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 focus:outline-none"
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
  <div className="text-right mt-1">
    <Link
      to="/forgot-password"
      className="text-xs text-green-600 hover:text-green-700 font-medium"
    >
      Forgot password?
    </Link>
  </div>
</div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
              Login as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SHOPKEEPER">Shopkeeper</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;