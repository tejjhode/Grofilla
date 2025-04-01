import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Star, Shield, BadgePercent, Package, CheckCircle } from 'lucide-react';
import HomeProductList from './HomeProductList';

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
      <div className="relative bg-cover bg-center h-[500px] overflow-hidden" 
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80")',
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
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
        {/* Promotional Discount Banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-green-700 text-white py-2 text-center text-lg font-semibold">
          <p>🎉 Limited Time Offer! Get 20% off on all first-time orders! 🎉</p>
        </div>
      </div>

      {/* Featured Promotions Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Exclusive Offers Just For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <BadgePercent className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold mb-2">Flash Deal - 50% Off</h3>
              </div>
              <p className="text-gray-600">Hurry up! Limited stock available at this discounted price!</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Package className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold mb-2">Buy 1 Get 1 Free</h3>
              </div>
              <p className="text-gray-600">Get an extra product on every purchase. Limited Time Offer!</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold mb-2">Flat 30% Off on Your First Order</h3>
              </div>
              <p className="text-gray-600">Enjoy a flat discount on your first purchase from our store!</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banners Section */}
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Special Ad Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Ad Banner 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://i.pinimg.com/736x/57/3f/65/573f65392b3b392b150d4c264421db54.jpg"
                alt="Ad 1"
                className="w-full h-auto mb-4 rounded-lg"
              />
              <p className="text-gray-600 text-center">Special Offer - Get 10% Off</p>
            </div>

            {/* Example Ad Banner 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://i.pinimg.com/736x/f0/f9/e4/f0f9e45724771f16745ad3f6f640d3ce.jpg"
                alt="Ad 2"
                className="w-full h-auto mb-4 rounded-lg"
              />
              <p className="text-gray-600 text-center">Buy More, Save More</p>
            </div>

            {/* Example Ad Banner 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://blog.smytten.com/wp-content/uploads/2024/09/Feature-69.jpg"
                alt="Ad 3"
                className="w-full h-auto mb-4 rounded-lg"
              />
              <p className="text-gray-600 text-center">Limited Time - Extra Discounts!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      <div className="">
        <div className="container mx-auto px-4">
          <HomeProductList /> {/* Display Product List Here */}
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