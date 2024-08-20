const ProductCategory = require('../models/productCategoryModel');
const getProductCategoryById = async (id, fromDate, toDate, search) => {
  const query = { _id: id };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
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

  return await ProductCategory.findOne(query);
};

const getAllProductCategories = async (fromDate, toDate, search) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
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

  return await ProductCategory.find(query);
};

const createProductCategory = async (data) => {
  const productCategory = new ProductCategory(data);
  return await productCategory.save();
};

const updateProductCategory = async (id, data) => {
  return await ProductCategory.findByIdAndUpdate(id, data, { new: true });
};

const deleteProductCategory = async (id) => {
  return await ProductCategory.findByIdAndDelete(id);
};

module.exports = {
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
getAllProductCategories,
};
