import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-50 to-white text-gray-800 border-t border-green-100 shadow-sm mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-extrabold text-green-800 mb-3">Grofilla</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Fresh groceries delivered to your doorstep — sustainably, affordably, and reliably. Grofilla is here to simplify your everyday life.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-green-600 transition-all">About Us</a></li>
            <li><a href="/contact" className="hover:text-green-600 transition-all">Contact</a></li>
            <li><a href="/careers" className="hover:text-green-600 transition-all">Careers</a></li>
            <li><a href="/blog" className="hover:text-green-600 transition-all">Blog</a></li>
          </ul>
        </div>

        {/* Support & Help */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-green-600 transition-all">FAQs</a></li>
            <li><a href="/returns" className="hover:text-green-600 transition-all">Return Policy</a></li>
            <li><a href="/shipping" className="hover:text-green-600 transition-all">Shipping Info</a></li>
            <li><a href="/help" className="hover:text-green-600 transition-all">Help Center</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Legal & Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/terms" className="hover:text-green-600 transition-all">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-green-600 transition-all">Privacy Policy</a></li>
            <li><a href="/cookies" className="hover:text-green-600 transition-all">Cookie Policy</a></li>
            <li><a href="/security" className="hover:text-green-600 transition-all">Security Info</a></li>
          </ul>
        </div>
      </div>

      {/* Newsletter & Socials */}
      <div className="bg-green-50 border-t py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Newsletter */}
          <div className="w-full md:w-2/3">
            <h4 className="text-lg font-semibold mb-2 text-green-800">Subscribe to our newsletter</h4>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 text-xl text-green-500">
            <a href="https://www.facebook.com/tejswa.jhode" target="_blank" rel="noopener noreferrer" className="hover:text-green-800 transition">
              <FaFacebook />
            </a>
            <a href="https://x.com/jhode27770" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/tejaswa_jhode" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/tejaswa-jhode-669362163/" target="_blank" rel="noopener noreferrer" className="hover:text-green-900 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-white py-4 text-center text-xs text-gray-500 border-t">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-green-600">Grofilla</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;