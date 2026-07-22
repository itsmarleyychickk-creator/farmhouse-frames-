const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;
    
    const order = new Order({
      userId: req.user.userId,
      items,
      total,
      shippingAddress,
      orderNumber: `ORD-${Date.now()}`
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get('/user/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
