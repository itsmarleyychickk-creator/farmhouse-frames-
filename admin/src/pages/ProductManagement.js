import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaImage, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: '',
    canvasType: 'single-piece',
    pieceCount: 1,
    material: '',
    frameStyle: '',
    quality: 'Premium',
    image: '',
    pieceDimensions: []
  });
  const [canvasImages, setCanvasImages] = useState([]);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'inventory' || name === 'pieceCount' 
        ? parseFloat(value) 
        : value
    });

    if (name === 'canvasType' && value === 'multi-piece') {
      const pieces = parseInt(formData.pieceCount) || 2;
      setFormData(prev => ({
        ...prev,
        pieceDimensions: Array(pieces).fill(null).map(() => ({
          width: 16,
          height: 24,
          description: ''
        }))
      }));
    }
  };

  const handlePieceDimensionChange = (index, field, value) => {
    const newDimensions = [...formData.pieceDimensions];
    newDimensions[index] = {
      ...newDimensions[index],
      [field]: field === 'width' || field === 'height' ? parseFloat(value) : value
    };
    setFormData({ ...formData, pieceDimensions: newDimensions });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/upload/product-image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({ ...formData, image: response.data.imageUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleCanvasImageUpload = async (e, pieceIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/upload/product-image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      const newCanvasImages = [...canvasImages];
      newCanvasImages[pieceIndex] = {
        pieceNumber: pieceIndex + 1,
        url: response.data.imageUrl,
        description: formData.pieceDimensions[pieceIndex]?.description || `Piece ${pieceIndex + 1}`
      };
      setCanvasImages(newCanvasImages);
      alert('Canvas image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading canvas image:', error);
      alert('Failed to upload canvas image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...formData,
        canvasImages: formData.canvasType === 'multi-piece' ? canvasImages : []
      };

      await axios.post(`${API_URL}/api/admin/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        inventory: '',
        category: '',
        canvasType: 'single-piece',
        pieceCount: 1,
        material: '',
        frameStyle: '',
        quality: 'Premium',
        image: '',
        pieceDimensions: []
      });
      setCanvasImages([]);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
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
          <h2 className="text-2xl font-bold mb-6">Add New Canvas Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
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
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Canvas">Canvas</option>
                  <option value="Canvas Set">Canvas Set</option>
                  <option value="Framed">Framed</option>
                  <option value="Metal Print">Metal Print</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            {/* Canvas Configuration */}
            <div className="bg-blue-50 p-4 rounded mb-4">
              <h3 className="text-xl font-bold mb-4">Canvas Configuration</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Canvas Type</label>
                  <select
                    name="canvasType"
                    value={formData.canvasType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  >
                    <option value="single-piece">Single Piece</option>
                    <option value="multi-piece">Multi-Piece</option>
                  </select>
                </div>
                {formData.canvasType === 'multi-piece' && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Number of Pieces</label>
                    <select
                      name="pieceCount"
                      value={formData.pieceCount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    >
                      <option value="2">2 Pieces (Diptych)</option>
                      <option value="3">3 Pieces (Triptych)</option>
                      <option value="4">4 Pieces</option>
                      <option value="5">5 Pieces</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Quality</label>
                  <select
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Elite">Elite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="e.g., Canvas, Metal"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Frame Style</label>
                  <input
                    type="text"
                    name="frameStyle"
                    value={formData.frameStyle}
                    onChange={handleChange}
                    placeholder="e.g., Rustic, Modern"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Piece Dimensions for Multi-Piece */}
            {formData.canvasType === 'multi-piece' && formData.pieceDimensions.length > 0 && (
              <div className="bg-green-50 p-4 rounded mb-4">
                <h3 className="text-lg font-bold mb-4">Piece Dimensions</h3>
                {formData.pieceDimensions.map((piece, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Width (inches)</label>
                      <input
                        type="number"
                        value={piece.width}
                        onChange={(e) => handlePieceDimensionChange(index, 'width', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Height (inches)</label>
                      <input
                        type="number"
                        value={piece.height}
                        onChange={(e) => handlePieceDimensionChange(index, 'height', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Description</label>
                      <input
                        type="text"
                        value={piece.description}
                        onChange={(e) => handlePieceDimensionChange(index, 'description', e.target.value)}
                        placeholder="e.g., Left panel"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing and Inventory */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price ($)</label>
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

            {/* Main Product Image */}
            <div className="mb-6 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaImage /> Main Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageLoading}
                className="block w-full text-sm text-gray-500"
              />
              {formData.image && (
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
              {imageLoading && <p className="mt-2 text-blue-600">Uploading...</p>}
            </div>

            {/* Canvas Images for Multi-Piece */}
            {formData.canvasType === 'multi-piece' && formData.pieceDimensions.length > 0 && (
              <div className="mb-6 p-4 bg-purple-50 rounded">
                <h3 className="text-lg font-bold mb-4">Canvas Images (One per Piece)</h3>
                {formData.pieceDimensions.map((piece, index) => (
                  <div key={index} className="mb-6 pb-6 border-b">
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <FaImage /> {piece.description || `Piece ${index + 1}`} Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCanvasImageUpload(e, index)}
                      disabled={imageLoading}
                      className="block w-full text-sm text-gray-500"
                    />
                    {canvasImages[index] && (
                      <div className="mt-4">
                        <img
                          src={canvasImages[index].url}
                          alt={`Piece ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 disabled:bg-gray-400"
              >
                {loading ? 'Adding...' : 'Add Product'}
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

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Product Name</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Inventory</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.filter(p => p.isActive).map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">{product.canvasType}</td>
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
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <p>No products yet. Click "Add Product" to create your first canvas!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;
