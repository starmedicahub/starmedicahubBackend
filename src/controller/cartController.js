const cartService = require('../service/cartService');
const Cart = require('../models/cart');

const getCartById = async (req, res) => {
  const cartId = req.query.cartId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const search = req.query.search || "";

  try {
    let carts;
    if (cartId) {
      // Fetch a specific cart by ID
      carts = await cartService.getCartById(cartId, fromDate, toDate, search);
      if (carts) {
        res.status(200).json(carts);
      } else {
        res.status(404).json({ message: 'Cart not found' });
      }
    } else {
      // Fetch all carts
      carts = await cartService.getAllCarts(fromDate, toDate, search);
      res.status(200).json(carts);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    // Get cart data from request body
    const cartData = req.body;

    // Create a new Cart instance with the provided data
    const cart = new Cart(cartData);

    // Save the cart to the database
    const savedCart = await cart.save();

    // Respond with the created cart and status 201 (Created)
    res.status(201).json(savedCart);
  } catch (error) {
    console.error(error);
    // Respond with a 500 status and error message if an error occurs
    res.status(500).json({ message: "An error occurred while creating the cart" });
  }
};


const updateCart = async (req, res) => {
  try {
    const cart = await cartService.updateCart(req.params.id, req.body);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await cartService.deleteCart(req.params.id);
    if (cart) {
      res.status(200).json({ message: 'Cart deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
