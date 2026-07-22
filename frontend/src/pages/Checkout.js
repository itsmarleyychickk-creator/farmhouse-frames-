import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total,
        shippingAddress: formData
      };
      
      const response = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Redirect to success page or account
      navigate(`/account`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white py-3 rounded font-semibold hover:bg-red-800 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          
          <div className="mb-6 max-h-96 overflow-y-auto">
            {cartItems.map((item, index) => (
              <div key={index} className="mb-4 pb-4 border-b">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
