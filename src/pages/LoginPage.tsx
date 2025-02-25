import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Ensure correct dispatch type
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: 'CUSTOMER' | 'SHOPKEEPER';
  }>({
    email: '',
    password: '',
    role: 'CUSTOMER', // Default role
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
  
  //   try {
  //     console.log("Submitting login request with:", formData); // Debugging log
  
  //     const response = await dispatch(login(formData)).unwrap();
  
  //     console.log("Login successful, response:", response);
  
  //     // Ensure response is valid before navigating
  //     if (response && response.token) {
  //         console.log("Navigating to home...");
  //         navigate('/');
  //     } else {
  //         console.warn("Unexpected response:", response);
  //         alert("Login failed: Invalid response from server.");
  //     }
  // } catch (err: any) {
  //     console.error("Login failed:", err);
  
  //     // Display backend error message (if available)
  //     if (err.response && err.response.data) {
  //         alert(err.response.data.message || "Login failed. Please try again.");
  //     } else {
  //         alert(err.message || "Login failed. Please try again.");
  //     }
  // }

  try {

    const response = await dispatch(login(formData)).unwrap();

    // console.log("Login successful, response:", response);

    // ✅ Ensure response contains valid user data before navigating
    if (response && response.id) {
        // console.log("Navigating to home...");
        navigate('/');
    } else {
        console.warn("Unexpected response:", response);
        alert("Login failed: Invalid response from server.");
    }
} catch (err: any) {
    console.error("Login failed:", err);

    // ✅ Display backend error message (if available)
    const errorMessage = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
    alert(errorMessage);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Login as
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SHOPKEEPER">Shopkeeper</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;