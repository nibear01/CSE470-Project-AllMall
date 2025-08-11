import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="!bg-gray-900 !text-white !w-full !pt-3 !px-2 sm:!px-3">
      <div className="!max-w-[90%] !m-auto !px-4 sm:!px-6 lg:!px-4 !py-2 !pt-5">
        <div className="!grid !mb-7 !grid-cols-1 xs:!grid-cols-2 sm:!grid-cols-2 md:!grid-cols-4 !gap-6 sm:!gap-8 md:!gap-10">
          {/* Company Info */}
          <div className="!mb-4 sm:!mb-0">
            <div className="!flex !items-center !gap-3 sm:!gap-4 !mb-3 sm:!mb-4">
              <span className="!text-emerald-500 !text-xl sm:!text-2xl">📦</span>
              <h1 className="!text-[24px] sm:!text-[28px] lg:!text-[30px] !font-[600]">AllMall</h1>
            </div>
            <p className="!text-gray-400 !text-sm sm:!text-[14px] !mb-3 sm:!mb-4">
              Your trusted e-commerce platform for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="!mb-4 sm:!mb-0">
            <h2 className="!text-base sm:!text-lg !font-semibold !mb-3 sm:!mb-4">Quick Links</h2>
            <ul className="!space-y-1 sm:!space-y-2">
              {['About Us', 'Products', 'Categories', 'Deals', 'Contact'].map((item, i) => (
                <li key={i} className='!my-2 sm:!my-3'>
                  <Link 
                    to="/" 
                    className="!text-gray-300 hover:!text-emerald-500 !text-[12px] sm:!text-[12px] !transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="!mb-4 sm:!mb-0">
            <h2 className="!text-base sm:!text-lg !font-semibold !mb-3 sm:!mb-4">Customer Service</h2>
            <ul className="!space-y-1 sm:!space-y-2">
              {['Help Center', 'Returns', 'Shipping Info', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                <li key={i} className='!my-2 sm:!my-3'>
                  <a 
                    href="#" 
                    className="!text-gray-300 hover:!text-emerald-500 !text-[12px] sm:!text-[12px] !transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="!text-base sm:!text-lg !font-semibold !mb-3 sm:!mb-4">Contact Info</h2>
            <div className="!space-y-2 sm:!space-y-3 !text-gray-300">
              <div className="!flex !items-center !gap-2 !my-2 sm:!my-3">
                <span className="!text-emerald-500 !text-sm sm:!text-base">📧</span>
                <span className="!text-[12px] sm:!text-[12px]">support@AllMall.com</span>
              </div>
              <div className="!flex !items-center !gap-2 !my-2 sm:!my-3">
                <span className="!text-emerald-500 !text-sm sm:!text-base">📞</span>
                <span className="!text-[12px] sm:!text-[12px]">+8801727312394</span>
              </div>
              <div className="!flex !items-center !gap-2 !my-2 sm:!my-3">
                <span className="!text-emerald-500 !text-sm sm:!text-base">📍</span>
                <span className="!text-[12px] sm:!text-[12px]">123 AbhoyNagar, Dhaka Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="!border-t !border-gray-800 !pt-3 !pb-2 sm:!py-3 !flex !items-center !justify-center">
          <p className="!text-gray-500 !text-xs sm:!text-[12px]">
            © {new Date().getFullYear()} AllMall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;