import React from 'react';

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">$12,450</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-purple-600">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-orange-600">142</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <p className="text-gray-600">Dashboard will display order analytics and statistics here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
