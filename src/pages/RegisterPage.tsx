import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { RootState } from '../store';
import { UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    address: '',
    phoneNumber: '',
    shopName: '',
    shopAddress: '',
  });

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    capital: false,
    number: false,
    special: false,
    match: false,
  });

  const validatePassword = (password: string, confirmPassword: string) => {
    setPasswordChecks({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && confirmPassword.length > 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === 'password' || name === 'confirmPassword') {
      validatePassword(
        name === 'password' ? value : formData.password,
        name === 'confirmPassword' ? value : formData.confirmPassword
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { role, name, email, password, address, phoneNumber, shopName, shopAddress } = formData;

    const userData = {
      name,
      email,
      password,
      role,
      ...(role === 'CUSTOMER' ? { address, phoneNumber } : { shopName, shopAddress }),
    };

    try {
      await dispatch(register(userData)).unwrap();
      navigate('/');
    } catch (err) {
      // Error handled in Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50 px-6 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
  <div className="relative">
    <input
      id="password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      value={formData.password}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 focus:outline-none"
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
</div>

<div>
  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
  <div className="relative">
    <input
      id="confirmPassword"
      name="confirmPassword"
      type={showConfirmPassword ? 'text' : 'password'}
      required
      value={formData.confirmPassword}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(prev => !prev)}
      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 focus:outline-none"
    >
      {showConfirmPassword ? 'Hide' : 'Show'}
    </button>
  </div>
</div>
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <p className={passwordChecks.length ? 'text-green-600' : 'text-red-500'}>• At least 8 characters</p>
              <p className={passwordChecks.capital ? 'text-green-600' : 'text-red-500'}>• At least one uppercase letter</p>
              <p className={passwordChecks.number ? 'text-green-600' : 'text-red-500'}>• At least one number</p>
              <p className={passwordChecks.special ? 'text-green-600' : 'text-red-500'}>• At least one special character</p>
              <p className={passwordChecks.match ? 'text-green-600' : 'text-red-500'}>• Passwords match</p>
            </div>

            {formData.role === 'CUSTOMER' && (
              <>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </>
            )}

            {formData.role === 'SHOPKEEPER' && (
              <>
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700">Shop Address</label>
                  <input
                    id="shopAddress"
                    name="shopAddress"
                    type="text"
                    required
                    value={formData.shopAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Object.values(passwordChecks).includes(false)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;