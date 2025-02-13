const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Order = require("../models/OrderSchema");
const Product = require("../models/product");

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const userId = res.locals.userId;
    const { productId, qty } = req.body;

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (qty > product.stock) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user_id: userId,
        items: [{ product_id: productId, qty, price: product.mrp }],
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity of existing item
        cart.items[itemIndex].qty += qty;
      } else {
        // Add new item to cart
        cart.items.push({ product_id: productId, qty, price: product.mrp });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const userId = res.locals.userId; // Extract user ID from middleware
    const { productId } = req.params; // Extract product ID from request params

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find and remove the item from the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in the cart" });
    }

    cart.items.splice(itemIndex, 1); // Remove the item from the cart

    await cart.save(); // Save the updated cart
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
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
const checkout = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const cart = await Cart.findOne({ user_id: userId }).populate(
      "items.product_id"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate the total and GST
    const total = cart.items.reduce(
      (sum, item) => sum + item.qty * item.product_id.mrp,
      0
    );
    const gst = total * 0.18; // Assuming GST is 18%
    console.log("item", cart.items);
    // Create a new order
    const order = new Order({
      user_id: userId,
      cart_id: cart._id,
      total,
      gst,
      items: cart.items.map((item) => ({
        product_id: item.product_id._id,
        qty: item.qty,
        price: item.product_id.mrp,
      })),
    });
    console.log(order);

    await order.save();

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get cart details
const getCartDetails = async (req, res) => {
  try {
    const userId = res.locals.userId; // Extract user ID from middleware

    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: "items.product_id",
      select: "itemName mrp stock image", // Specify fields to return for products
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ error: "Cart is empty" });
    }

    res.status(200).json({ message: "Cart retrieved successfully", cart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const orders = await Order.find({ user_id : userId })
      .populate({
        path: "cart_id",
        populate: {
          path: "items.product_id",
          select: "itemName mrp",
        },
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const   getOrdersByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const orders = await Order.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          order_id: '$_id',
          total: 1,
          user_name: '$userDetails.name',
          createdAt: 1
        }
      }
    ]);

    if (!orders.length) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { user_id, order_id } = req.params;

    const orders = await Order.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
          _id: new mongoose.Types.ObjectId(order_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product_id',
          foreignField: '_id',
          as: 'items.productDetails'
        }
      },
      { $unwind: '$items.productDetails' },
      {
        $group: {
          _id: '$_id',
          user_id: { $first: '$user_id' },
          user: { $first: '$userDetails' },
          items: { $push: '$items' },
          total: { $first: '$total' },
          gst: { $first: '$gst' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' }
        }
      },
      {
        $project: {
          'user.password': 0,
          'user.__v': 0,
          'user.hashPass': 0,
          'user.saltPass': 0,
          'user.createdId': 0,
          'user.modifiedId': 0
        }
      }
    ]);

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order details retrieved successfully', order: orders[0] });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Export all functions
module.exports = {
  addItemToCart,
  removeItemFromCart,
  clearCart,
  checkout,
  getCartDetails,
  getUserOrders,
  getOrdersByUserId,
  getOrderDetails
};
