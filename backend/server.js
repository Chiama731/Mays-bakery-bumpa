require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Store, Product, Order } = require('./models');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using environment variables
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

// 1. GET ALL PRODUCTS FOR A SPECIFIC STORE SLUG
app.get('/api/store/:slug/products', async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const products = await Product.find({ storeId: store._id });
    res.json({ store, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE A NEW PRODUCT (Merchant Action)
app.post('/api/products', async (req, res) => {
  try {
    const { storeId, title, description, price, stock, imageUrl } = req.body;
    const product = new Product({ storeId, title, description, price, stock, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. CREATE AN ORDER (Shopper Action)
app.post('/api/orders', async (req, res) => {
  try {
    const { storeId, customerName, customerPhone, deliveryAddress, items, totalAmount } = req.body;
    const order = new Order({
      storeId,
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      totalAmount
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));