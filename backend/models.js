// backend/models.js
const mongoose = require('mongoose');

// Store / Merchant Schema
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g. "mays-bakery"
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 10 },
  imageUrl: String
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: String,
  items: [{
    productId: String,
    title: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = {
  Store: mongoose.model('Store', storeSchema),
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema)
};