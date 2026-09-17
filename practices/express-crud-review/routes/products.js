const express = require("express");
const { ObjectId } = require("mongodb");
const ProductModel = require("../models/Product");

const router = express.Router();

// Middleware này chuẩn bị ProductModel cho mọi product route bên dưới.
router.use((req, res, next) => {
  const database = req.app.locals.db;

  if (!database) {
    return res.status(503).json({
      message: "Database is not ready.",
    });
  }

  // Gắn model vào request để route handler hiện tại sử dụng.
  req.productModel = new ProductModel(database);
  return next();
});

// GET /products - lấy toàn bộ product.
router.get("/", async (req, res, next) => {
  try {
    const products = await req.productModel.getAll();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
});

// POST /products/add - thêm một product từ JSON request body.
router.post("/add", async (req, res, next) => {
  try {
    const product = await req.productModel.add(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});

// PUT /products/:id - cập nhật các field được gửi trong request body.
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const result = await req.productModel.update(id, req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({
      message: "Product updated.",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

// DELETE /products/:id - xóa product theo MongoDB ObjectId.
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const result = await req.productModel.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({
      message: "Product deleted.",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
