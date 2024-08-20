const productCategoryService = require('../service/productCategoryService');


const getProductCategoryById = async (req, res) => {
  const categoryId = req.query.categoryId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const search = req.query.search || "";

  try {
    let categories;
    if (categoryId) {
      // Fetch a specific category by ID
      categories = await productCategoryService.getProductCategoryById(categoryId, fromDate, toDate, search);
      if (categories) {
        res.status(200).json(categories);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } else {
      // Fetch all categories based on filters
      categories = await productCategoryService.getAllProductCategories(fromDate, toDate, search);
      res.status(200).json(categories);
    }
  } catch (error) {
    console.error("Failed to retrieve product categories:", error);
    res.status(500).json({ message: error.message });
  }
};

const createProductCategory = async (req, res) => {
  try {
    const category = await productCategoryService.createProductCategory({
      ...req.body,
      image: req.file.path,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProductCategory = async (req, res) => {
  try {
    const updatedData = req.file ? { ...req.body, image: req.file.path } : req.body;
    const category = await productCategoryService.updateProductCategory(req.params.id, updatedData);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProductCategory = async (req, res) => {
  try {
    const category = await productCategoryService.deleteProductCategory(req.params.id);
    if (category) {
      res.status(200).json({ message: ' Product Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
