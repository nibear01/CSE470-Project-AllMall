import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-500 text-xl sm:text-2xl">📦</span>
              <h1 className="text-2xl sm:text-3xl font-semibold">AllMall</h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted e-commerce platform for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {['About Us', 'Products', 'Categories', 'Deals', 'Contact'].map((item, i) => (
                <li key={i}>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-emerald-500 text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-4">Customer Service</h2>
            <ul className="space-y-2">
              {['Help Center', 'Returns', 'Shipping Info', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-emerald-500 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">📧</span>
                <span className="text-sm break-words">support@AllMall.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-base">📞</span>
                <span className="text-sm">+8801727312394</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 text-base flex-shrink-0">📍</span>
                <span className="text-sm">123 AbhoyNagar, Dhaka Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 pb-4 sm:py-6 flex items-center justify-center">
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} AllMall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;