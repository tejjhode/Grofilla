import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Star, Shield } from 'lucide-react';
import ProductList from '../pages/ProductList'; 

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      title: 'Wide Selection',
      description: 'Browse through thousands of fresh groceries from local shops',
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: 'Fast Delivery',
      description: 'Get your groceries delivered to your doorstep within hours',
    },
    {
      icon: <Star className="h-8 w-8 text-green-600" />,
      title: 'Quality Assured',
      description: 'All products are verified for quality and freshness',
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Secure Shopping',
      description: 'Safe and secure shopping experience guaranteed',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[500px]"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Fresh Groceries Delivered to Your Door
            </h1>
            <p className="text-xl mb-8">
              Shop from local stores and get your groceries delivered within hours.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      

      {/* Product List Section */}
      <div className="">
        <div className="container mx-auto px-4">
          <ProductList /> {/* Display Product List Here */}
        </div>
      </div>
{/* Features Section */}
<div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Grofila?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Shopping?</h2>
          <p className="text-white text-xl mb-8">
            Join thousands of happy customers who trust Grofila for their grocery needs.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;