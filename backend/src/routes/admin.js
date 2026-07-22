const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Product Management
router.post('/products', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Management
router.get('/orders', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Management
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
