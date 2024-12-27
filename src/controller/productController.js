const productService = require("../service/productService");

const getProductById = async (req, res) => {
  const productId = req.query.productId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const search = req.query.search || "";

  try {
    const products = await productService.getProductById(
      productId,
      fromDate,
      toDate,
      search
    );
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Failed to retrieve products:", error);
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file.path,
    };
    const product = await productService.createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file.path ? req.file.path : "",
    };
    const product = await productService.updateProduct(
      req.params.id,
      productData
    );
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (product) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
