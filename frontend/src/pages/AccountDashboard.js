import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AccountDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/orders/user/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-700 text-white py-2 rounded font-semibold hover:bg-red-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded font-semibold hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-2"><strong>Name:</strong> {profile.name}</p>
              <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
              <p className="mb-6"><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-red-700 text-white py-2 rounded font-semibold hover:bg-red-800"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Order History</h2>
          
          {orders.length === 0 ? (
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border-l-4 border-red-700 pl-4 py-2">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                  <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountDashboard;
