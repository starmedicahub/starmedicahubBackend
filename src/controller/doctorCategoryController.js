const doctorCategoryService = require('../service/doctorCategoryService');

const getDoctorCategoryById = async (req, res) => {
  const categoryId = req.query.categoryId;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  const search = req.query.search || "";

  try {
    let categories;
    if (categoryId) {
      // Fetch a specific category by ID
      categories = await doctorCategoryService.getDoctorCategoryById(categoryId, fromDate, toDate, search);
      if (categories) {
        res.status(200).json(categories);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } else {
      // Fetch all categories based on filters
      categories = await doctorCategoryService.getAllDoctorCategories(fromDate, toDate, search);
      res.status(200).json(categories);
    }
  } catch (error) {
    console.error("Failed to retrieve doctor categories:", error);
    res.status(500).json({ message: error.message });
  }
};


const createDoctorCategory = async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
    };
    const category = await doctorCategoryService.createDoctorCategory(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateDoctorCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Check if a new image is uploaded
    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await doctorCategoryService.updateDoctorCategory(req.params.id, categoryData);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDoctorCategory = async (req, res) => {
  try {
    const category = await doctorCategoryService.deleteDoctorCategory(req.params.id);
    console.log(req.params.id)
    if (category) {
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorCategoryById,
  createDoctorCategory,
  updateDoctorCategory,
  deleteDoctorCategory,
};
