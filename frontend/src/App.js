import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountDashboard from './pages/AccountDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <Navigation isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/account" element={isAuthenticated ? <AccountDashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
