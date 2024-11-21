const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product'); // Assuming a Product model exists

// Add item to cart
const addItemToCart = async (req) => {
  const userId = req.userId; // Extracted from token via middleware
  const { productId, qty } = req.body;

  const cart = await Cart.findOne({ user_id: userId });
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (qty > product.stock) {
    throw new Error('Insufficient stock');
  }

  if (!cart) {
    // Create a new cart if not exists
    const newCart = new Cart({
      user_id: userId,
      items: [{ product_id: productId, qty, price: product.price }],
    });
    return await newCart.save();
  }

  // If cart exists, update the items
  const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === productId);

  if (itemIndex > -1) {
    // If item already exists, update the quantity
    cart.items[itemIndex].qty += qty;
  } else {
    // Add new item to cart
    cart.items.push({ product_id: productId, qty, price: product.price });
  }

  return await cart.save();
};

// Remove item from cart
const removeItemFromCart = async (req) => {
  const userId = req.userId; // Extracted from token via middleware
  const { productId } = req.params;

  const cart = await Cart.findOne({ user_id: userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item.product_id.toString() !== productId);

  return await cart.save();
};

// Clear the cart
const clearCart = async (req) => {
  const userId = req.userId; // Extracted from token via middleware

  return await Cart.findOneAndUpdate(
    { user_id: userId },
    { $set: { items: [] } },
    { new: true }
  );
};

// Checkout the cart
const checkout = async (req) => {
  const userId = req.userId; // Extracted from token via middleware

  const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Calculate total
  const total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Create an order
  const order = new Order({
    user_id: userId,
    cart_id: cart._id,
    total,
    gst: total * 0.18, // Example GST calculation
  });
  await order.save();

  // Clear cart
  cart.items = [];
  await cart.save();

  return order;
};

// Get cart details
const getCartDetails = async (req) => {
  const userId = req.userId; // Extracted from token via middleware
  return await Cart.findOne({ user_id: userId }).populate('items.product_id');
};

// Get user orders
const getUserOrders = async (req) => {
  const userId = req.userId; // Extracted from token via middleware
  return await Order.find({ user_id: userId }).populate({
    path: 'cart_id',
    populate: {
      path: 'items.product_id',
    },
  });
};

// Export all functions
module.exports = {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  checkout,
  getCartDetails,
  getUserOrders,
};
