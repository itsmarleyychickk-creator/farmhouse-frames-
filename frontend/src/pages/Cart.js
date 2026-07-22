import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, quantity) => {
    const newCart = [...cartItems];
    newCart[index].quantity = quantity;
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/shop" className="text-red-700 font-semibold hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow mb-4 flex gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-700 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>TBD</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-700 text-white py-3 rounded font-semibold hover:bg-red-800"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
