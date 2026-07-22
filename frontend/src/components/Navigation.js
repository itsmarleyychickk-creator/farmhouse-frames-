import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

function Navigation({ isAuthenticated, user, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-2xl text-gray-800 font-serif">
            Farmhouse Frames
          </Link>
          
          <div className="flex gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 uppercase text-sm font-semibold">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-gray-900 uppercase text-sm font-semibold">
              Shop
            </Link>
          </div>
          
          <div className="flex gap-4 items-center">
            <Link to="/cart" className="text-gray-700 hover:text-gray-900">
              <FaShoppingCart size={20} />
            </Link>
            
            {isAuthenticated ? (
              <div className="flex gap-4 items-center">
                <Link to="/account" className="text-gray-700 hover:text-gray-900">
                  <FaUser size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-semibold text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
