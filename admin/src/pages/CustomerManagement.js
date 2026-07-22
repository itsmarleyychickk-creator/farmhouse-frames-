import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.filter(user => user.role === 'customer'));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Customer Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{customer.name}</td>
                <td className="px-6 py-3">{customer.email}</td>
                <td className="px-6 py-3">{customer.phone || '-'}</td>
                <td className="px-6 py-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    customer.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerManagement;
