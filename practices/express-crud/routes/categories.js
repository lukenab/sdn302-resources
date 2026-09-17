const express = require("express");
const { ObjectId } = require("mongodb");
const CategoryModel = require("../models/Category");

const router = express.Router();

// Chuẩn bị CategoryModel cho các route category.
router.use((req, res, next) => {
  const database = req.app.locals.db;

  if (!database) {
    return res.status(503).json({
      message: "Database is not ready.",
    });
  }

  req.categoryModel = new CategoryModel(database);
  return next();
});

// GET /categories - lấy toàn bộ category.
router.get("/", async (req, res, next) => {
  try {
    const categories = await req.categoryModel.getAll();
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
});

// POST /categories/add - thêm category mới.
router.post("/add", async (req, res, next) => {
  try {
    const category = await req.categoryModel.add(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
});

// PUT /categories/:id - cập nhật category theo ObjectId.
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const result = await req.categoryModel.update(id, req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category updated.",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /categories/:id - xóa category theo ObjectId.
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const result = await req.categoryModel.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category deleted.",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
