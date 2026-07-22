import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import CustomerManagement from './pages/CustomerManagement';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        setIsAuthenticated(true);
        setIsAdmin(true);
      }
    }
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />;
  }

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
