const Cart = require('../models/cart');
const mongoose =require('mongoose');
const User = require('../models/collection');

const getCartById = async (id, fromDate, toDate, search, userId) => {
  const query = {};

  // If cartId is provided, filter by cartId
  if (id) {
    query._id = id;
  }

  if (userId) {
    try {

      const userExists = await User.findById(userId);
      if (!userExists) {
        throw new Error('User ID not found');
      }
      query.user_id = new mongoose.Types.ObjectId(userId);  
    } catch (error) {
      throw new Error('User ID not found in cart');
    }
  }

  // Handle date filters
  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      query.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      query.createdAt.$lte = new Date(toDate);
    }
  }

  // Handle search filter
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  console.log(query); // Debugging: Log the query to verify it

  // Fetch the cart based on the filters and populate necessary fields
  return await Cart.find(query)
    .populate('items.product_id')  // Populate the product details in the cart items
    .populate('user_id');  // Populate the user details (if needed)
};


const getAllCarts = async (fromDate, toDate, search) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      query.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      query.createdAt.$lte = new Date(toDate);
    }
  }


  return await Cart.find(query)
    .populate('items.product_id')
    .populate('user_id');
};


const createCart = async (cartData) => {
  const cart = new Cart(cartData);
  return await cart.save();
};

const updateCart = async (id, cartData) => {
  return await Cart.findByIdAndUpdate(id, { $set: cartData }, { new: true });
};

const deleteCart = async (id) => {
  return await Cart.findByIdAndDelete(id);
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
