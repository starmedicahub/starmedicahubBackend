const DoctorCategory = require('../models/doctorCategoryModel');


const getDoctorCategoryById = async (id, fromDate, toDate, search) => {
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

  return await DoctorCategory.findOne(query);
};

const getAllDoctorCategories = async (fromDate, toDate, search) => {
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

  return await DoctorCategory.find(query);
};

const createDoctorCategory = async (data) => {
  const doctorCategory = new DoctorCategory(data);
  return await doctorCategory.save();
};

const updateDoctorCategory = async (id, data) => {
  return await DoctorCategory.findByIdAndUpdate(id, data, { new: true });
};

const deleteDoctorCategory = async (id) => {
  return await DoctorCategory.findByIdAndDelete(id);
};

module.exports = {
  getDoctorCategoryById,
  createDoctorCategory,
  updateDoctorCategory,
  deleteDoctorCategory,
  getAllDoctorCategories
};
