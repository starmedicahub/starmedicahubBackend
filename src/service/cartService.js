const Cart = require('../models/cart');

const getCartById = async (id, fromDate, toDate, search) => {
  const query = { _id: id };

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

  return await Cart.findOne(query)
    .populate('items.product_id')
    .populate('user_id');
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
