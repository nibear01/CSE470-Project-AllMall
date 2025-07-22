import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-[100%] !pt-5 !px-5">
      <div className="max-w-[90%] !m-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="grid !mb-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-emerald-500 text-2xl">📦</span>
              <h1 className="text-[30px] font-[600]">AllMall</h1>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted e-commerce platform for quality products and exceptional service.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {['About Us', 'Products', 'Categories', 'Deals', 'Contact'].map((item, i) => (
                <li key={i} className='!my-3'>
                  <Link to="/" className="text-gray-300 hover:text-emerald-500 !mb-3 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Service</h2>
            <ul className="space-y-2">
              {['Help Center', 'Returns', 'Shipping Info', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                <li key={i} className='!my-3'>
                  <a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
            <div className="space-y-3 text-gray-300 ">
              <div className="flex items-center !gap-2 !my-3">
                <span className="text-emerald-500">📧</span>
                <span>support@AllMall.com</span>
              </div>
              <div className="flex items-center gap-2 !my-3">
                <span className="text-emerald-500">📞</span>
                <span>+8801727312394</span>
              </div>
              <div className="flex items-center gap-2 !my-3">
                <span className="text-emerald-500">📍</span>
                <span>123 AbhoyNagar, Dhaka Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 !p-3 flex align-middle justify-center">
          <p className="text-gray-500 text-[12px] flex align-middle justify-center">
            © 2025 AllMall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
