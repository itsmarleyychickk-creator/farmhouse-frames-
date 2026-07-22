import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/products`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', description: '', price: '', inventory: '', category: '' });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
        >
          <FaPlus /> Add Product
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
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
                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Inventory</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded font-semibold hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Product Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Inventory</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.filter(p => p.isActive).map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">{product.category}</td>
                <td className="px-6 py-3">${product.price}</td>
                <td className="px-6 py-3">{product.inventory}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button className="text-blue-700 hover:text-blue-900">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-700 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;
