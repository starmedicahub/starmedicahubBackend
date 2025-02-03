const Product = require("../models/product");

const getProductById = async (id, fromDate, toDate, search, productCategoryId) => {
  try {
    const query = {};

    // Add filters based on provided parameters
    if (id) query._id = id;
    if (productCategoryId) query.productCategory = productCategoryId;

    // Add search conditions if a search term is provided
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
      const regexSearch = { $regex: escapedSearch, $options: "i" };

      query["$or"] = [
        { itemName: regexSearch },
        { about: regexSearch },
        { ptr: regexSearch },
        { doctorCategory: regexSearch },
        { companyName: regexSearch },
        { sellerName: regexSearch },
        { productCategory: regexSearch },
        { dis: regexSearch },
        { hns: regexSearch },
        { inv: regexSearch },
      ];
    }

    // Add date range filter if dates are provided
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    // Execute the query and populate related fields
    const products = await Product.find(query)
      .populate("doctorCategory")
      .populate("productCategory");

    return products;
  } catch (error) {
    console.error("Error fetching product data:", error.message);
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
