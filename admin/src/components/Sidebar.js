import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Farmhouse Frames</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>
      
      <nav className="flex-1 p-6 space-y-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition"
        >
          <FaHome /> Dashboard
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition"
        >
          <FaBox /> Products
        </Link>
        <Link
          to="/orders"
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition"
        >
          <FaShoppingCart /> Orders
        </Link>
        <Link
          to="/customers"
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition"
        >
          <FaUsers /> Customers
        </Link>
      </nav>
      
      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-700 hover:bg-red-800 transition font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
