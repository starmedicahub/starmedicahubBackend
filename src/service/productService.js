const Product = require("../models/product");
const mongoose = require("mongoose");

const getProductById = async (id, fromDate, toDate, search, productCategoryId) => {
  try {
    const query = {};

    // Add filters based on provided parameters
    if (id) query._id = id;
    if (productCategoryId) query.productCategory = productCategoryId; // Ensure this is passed

    // Add search conditions if a search term is provided
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regexSearch = { $regex: escapedSearch, $options: "i" };

      query["$or"] = [];

      // Apply regex search only to string fields
      const stringFields = ["itemName", "about", "companyName", "sellerName","ptr", "dis", "hns", "inv"];
      stringFields.forEach(field => query["$or"].push({ [field]: regexSearch }));

      // Convert search term to number and apply only to numeric fields
      const numericSearch = Number(search);
      if (!isNaN(numericSearch)) {
        const numericFields = ["mrp", "stock", "code", "gst"];
        numericFields.forEach(field => query["$or"].push({ [field]: numericSearch }));
      }

      // Handle ObjectId fields separately
      if (mongoose.Types.ObjectId.isValid(search)) {
        query["$or"].push(
          { productCategory: new mongoose.Types.ObjectId(search) },
          { doctorCategory: new mongoose.Types.ObjectId(search) }
        );
      }
    }

    // Add date range filter if dates are provided
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    console.log("Final Query:", JSON.stringify(query, null, 2)); // Debugging purpose

    // Execute the query and populate related fields
    const products = await Product.find(query)
      .populate("doctorCategory")
      .populate("productCategory");

    return products;
  } catch (error) {
    console.error("Error fetching product data:", error); // Log full error
    throw new Error("Unable to fetch product data. Please try again later.");
  }
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
  deleteProduct,
};
