// Đọc các biến MONGODB_URI, DB_NAME và PORT từ file .env.
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { MongoClient } = require("mongodb");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

const app = express();

// Tạo MongoClient bằng địa chỉ MongoDB Server trong .env.
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    // Chờ ứng dụng kết nối tới MongoDB Server.
    await client.connect();

    // Lưu database vào app.locals để các router có thể dùng chung.
    app.locals.db = client.db(process.env.DB_NAME);

    console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectDB();

// Cấu hình EJS và vị trí thư mục views.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Các middleware chung của ứng dụng.
app.use(logger("dev"));
app.use(express.json()); // Đọc JSON body và đưa dữ liệu vào req.body.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Mount các router trước middleware 404.
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

// Nếu không route nào khớp, chuyển lỗi 404 tới error handler.
app.use((req, res, next) => {
  next(createError(404));
});

// Error-handling middleware phải có đủ bốn tham số.
app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  res.status(error.status || 500);
  res.render("error");
});

module.exports = app;
