const Product = require('../models/product');

const getProductById = async (id, fromDate, toDate, search) => {
  const query = {};

  if (id) {
    query._id = id;
  }

  if (search) {
    query.$or = [
      { itemName: { $regex: search, $options: "i" } },
      { about: { $regex: search, $options: "i" } },
      { ptr: { $regex: search, $options: "i" } },
      { doctorCategory: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { sellerName: { $regex: search, $options: "i" } },
      { productCategory: { $regex: search, $options: "i" } },
      { dis: { $regex: search, $options: "i" } },
      { hns: { $regex: search, $options: "i" } },
      { inv: { $regex: search, $options: "i" } }
    ];
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

  return await Product.find(query)
    .populate('doctorCategory')
    .populate('productCategory');
};

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
