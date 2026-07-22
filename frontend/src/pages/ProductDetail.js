import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, quantity });
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (!product) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        {product.image && (
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow"
            />
          </div>
        )}
        
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-red-700">${product.price}</span>
            <p className={`text-lg mt-2 ${product.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of Stock'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <input
              type="number"
              min="1"
              max={product.inventory}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded font-semibold hover:bg-red-800 disabled:bg-gray-400"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
