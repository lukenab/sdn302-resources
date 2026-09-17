# Practice 3 Review Guide — Express Generator, MongoDB và EJS

Tài liệu này giúp tự code lại Practice 3 bằng **CommonJS**, đúng cấu trúc Express Generator và tương thích với MongoDB Driver hiện tại.

## Mục lục

1. [Mục tiêu](#1-mục-tiêu)
2. [Bức tranh tổng thể](#2-bức-tranh-tổng-thể)
3. [Khởi tạo project](#3-khởi-tạo-project)
4. [Hiểu cấu trúc Express Generator](#4-hiểu-cấu-trúc-express-generator)
5. [Cấu hình môi trường](#5-cấu-hình-môi-trường)
6. [Kết nối MongoDB](#6-kết-nối-mongodb)
7. [Viết Product Model](#7-viết-product-model)
8. [Viết Product Router](#8-viết-product-router)
9. [Mount router trong app.js](#9-mount-router-trong-appjs)
10. [Viết Category CRUD](#10-viết-category-crud)
11. [Test bằng Postman](#11-test-bằng-postman)
12. [Luồng thực thi](#12-luồng-thực-thi)
13. [Kiến thức cần nắm](#13-kiến-thức-cần-nắm)
14. [Lỗi thường gặp](#14-lỗi-thường-gặp)
15. [Cần nhớ và không cần học thuộc](#15-cần-nhớ-và-không-cần-học-thuộc)
16. [Checklist code lại](#16-checklist-code-lại)
17. [Câu hỏi tự kiểm tra](#17-câu-hỏi-tự-kiểm-tra)

---

## 1. Mục tiêu

Sau bài này cần hiểu và làm được:

- Dùng Express Generator tạo khung project.
- Phân biệt `app.js` và `bin/www`.
- Kết nối Node.js với MongoDB bằng MongoDB Driver.
- Hiểu `process.env`, `app.locals` và `req.app.locals`.
- Viết Model thao tác với collection.
- Viết Router và route handler.
- Hiểu router middleware và `next()`.
- Thực hiện CRUD bằng MongoDB Driver.
- Test API khi chưa có frontend bằng Postman.

## 2. Bức tranh tổng thể

```text
Postman
   ↓ HTTP request
Express application
   ↓
Router middleware
   ↓
Route handler
   ↓
ProductModel / CategoryModel
   ↓
MongoDB Driver
   ↓
MongoDB Server
   ↓
JSON response
```

Phân chia trách nhiệm:

| Thành phần | Trách nhiệm |
|---|---|
| `bin/www` | Tạo HTTP server và mở port |
| `app.js` | Cấu hình Express, MongoDB, middleware và mount router |
| `routes/*.js` | Nhận request, gọi model và gửi response |
| `models/*.js` | Thực hiện thao tác với MongoDB collection |
| `.env` | Lưu connection string, database name và port |

## 3. Khởi tạo project

```powershell
npx express-generator --view=ejs express-crud-review
cd express-crud-review
npm install
npm install mongodb dotenv
npm pkg set scripts.dev="node --watch ./bin/www"
```

Ý nghĩa:

- `npx express-generator`: chạy công cụ tạo khung Express.
- `--view=ejs`: chọn EJS làm view engine.
- `npm install`: cài dependency generator đã khai báo.
- `mongodb`: Node.js MongoDB Driver.
- `dotenv`: đọc biến môi trường từ `.env`.
- `node --watch`: tự restart server khi source code thay đổi.

Practice 3 dùng CommonJS, vì vậy không thêm:

```json
"type": "module"
```

CommonJS sử dụng:

```js
const express = require("express");
module.exports = router;
```

## 4. Hiểu cấu trúc Express Generator

```text
express-crud-review/
├── app.js
├── bin/
│   └── www
├── models/
│   ├── Product.js
│   └── Category.js
├── routes/
│   ├── index.js
│   ├── users.js
│   ├── products.js
│   └── categories.js
├── views/
├── public/
├── .env
├── package.json
└── package-lock.json
```

### `app.js`

Tạo và cấu hình Express application:

```js
const app = express();
```

`app.js` không trực tiếp mở port.

### `bin/www`

Lấy Express application, tạo HTTP server và listen:

```js
const app = require("../app");
const http = require("http");

const server = http.createServer(app);
server.listen(port);
```

Không cần học thuộc toàn bộ boilerplate trong `bin/www`.

## 5. Cấu hình môi trường

Tạo `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=express_crud_review
PORT=3001
```

Thêm vào `.gitignore`:

```gitignore
node_modules/
.env
```

### `process.env`

```js
require("dotenv").config();

process.env.MONGODB_URI;
process.env.DB_NAME;
process.env.PORT;
```

`process.env` chứa biến môi trường của tiến trình Node.js.

Phân biệt:

```text
MONGODB_URI → MongoDB Server nằm ở đâu?
DB_NAME     → Sử dụng database nào?
PORT        → HTTP server mở cổng nào?
```

Không truyền `DB_NAME` vào `MongoClient`:

```js
// Sai
new MongoClient(process.env.DB_NAME);

// Đúng
new MongoClient(process.env.MONGODB_URI);
```

## 6. Kết nối MongoDB

Trong `app.js`:

```js
require("dotenv").config();

const { MongoClient } = require("mongodb");

const app = express();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();

    app.locals.db = client.db(process.env.DB_NAME);

    console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectDB();
```

Giải thích:

```js
const client = new MongoClient(process.env.MONGODB_URI);
```

Tạo MongoClient nhưng chưa kết nối mạng.

```js
await client.connect();
```

Thực sự bắt đầu kết nối và chờ Promise hoàn thành.

```js
client.db(process.env.DB_NAME);
```

Lấy object đại diện cho database.

```js
app.locals.db = ...;
```

Lưu database object dùng chung trong Express application.

Router lấy lại bằng:

```js
req.app.locals.db;
```

## 7. Viết Product Model

Tạo `models/Product.js`:

```js
const { ObjectId } = require("mongodb");

class ProductModel {
  constructor(database) {
    this.collection = database.collection("products");
  }

  async getAll() {
    return this.collection.find({}).toArray();
  }

  async getById(id) {
    return this.collection.findOne({
      _id: new ObjectId(id),
    });
  }

  async add(product) {
    const result = await this.collection.insertOne(product);

    return {
      ...product,
      _id: result.insertedId,
    };
  }

  async update(id, product) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: product },
    );
  }

  async delete(id) {
    return this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = ProductModel;
```

### Vai trò của Model

Model tập trung code làm việc với collection:

```text
Router yêu cầu: “Lấy tất cả product”
Model quyết định: collection.find({}).toArray()
```

Router không cần biết chi tiết truy vấn MongoDB.

### Constructor

Khi chạy:

```js
new ProductModel(database);
```

constructor tự động chạy:

```js
constructor(database) {
  this.collection = database.collection("products");
}
```

Constructor chỉ chuẩn bị collection, chưa truy vấn dữ liệu.

### Cursor

```js
const cursor = this.collection.find({});
```

`find()` trả cursor, không trả array ngay. Cursor đại diện cho kết quả truy vấn và cho phép MongoDB đọc dữ liệu theo từng batch.

```js
const products = await cursor.toArray();
```

`toArray()` đọc cursor và trả Promise chứa array.

```text
find({}) → Cursor
toArray() → Promise<Array>
await → Array
```

### API cũ cần tránh

MongoDB Driver mới không dùng:

```js
result.ops[0];
```

Dùng:

```js
result.insertedId;
```

## 8. Viết Product Router

Tạo `routes/products.js`.

### 8.1 Khởi tạo router

```js
const express = require("express");
const { ObjectId } = require("mongodb");
const ProductModel = require("../models/Product");

const router = express.Router();
```

### 8.2 Router middleware

```js
router.use((req, res, next) => {
  const database = req.app.locals.db;

  if (!database) {
    return res.status(503).json({
      message: "Database is not ready.",
    });
  }

  req.productModel = new ProductModel(database);
  return next();
});
```

Middleware này:

1. Lấy database từ `app.locals`.
2. Trả `503` nếu database chưa sẵn sàng.
3. Tạo ProductModel.
4. Gắn model vào request hiện tại.
5. Gọi `next()` để đi tới route handler.

`req.productModel` không phải property có sẵn; đây là property tự thêm để truyền model qua chuỗi middleware.

### 8.3 GET all

```js
router.get("/", async (req, res, next) => {
  try {
    const products = await req.productModel.getAll();
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
});
```

### 8.4 POST add

```js
router.post("/add", async (req, res, next) => {
  try {
    const product = await req.productModel.add(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});
```

`req.body` được tạo bởi:

```js
app.use(express.json());
```

### 8.5 PUT update

```js
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
```

`req.params.id` là string từ URL. Model chuyển nó thành MongoDB `ObjectId`.

### 8.6 DELETE

```js
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
```

## 9. Mount router trong app.js

Import router:

```js
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
```

Mount trước middleware 404:

```js
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

app.use((req, res, next) => {
  next(createError(404));
});
```

Đường dẫn được ghép:

```text
app.use("/products", productsRouter)
                    +
router.get("/")
                    =
GET /products
```

```text
app.use("/products", productsRouter)
                    +
router.put("/:id")
                    =
PUT /products/:id
```

## 10. Viết Category CRUD

Category dùng cùng pattern với Product:

```text
models/Category.js
routes/categories.js
```

Khác biệt chính:

```js
this.collection = database.collection("categories");
```

Và middleware tạo:

```js
req.categoryModel = new CategoryModel(database);
```

Các endpoint:

```text
GET    /categories
POST   /categories/add
PUT    /categories/:id
DELETE /categories/:id
```

Không cần học thuộc lại Category nếu đã hiểu Product. Mục tiêu của Category là chứng minh có thể áp dụng lại cùng pattern cho resource khác.

## 11. Test bằng Postman

Chạy:

```powershell
npm start
```

### Product

#### GET

```http
GET http://localhost:3001/products
```

#### POST

```http
POST http://localhost:3001/products/add
Content-Type: application/json
```

```json
{
  "name": "Keyboard",
  "price": 120,
  "category": "Accessories"
}
```

Sao chép `_id` từ response.

#### PUT

```http
PUT http://localhost:3001/products/<PRODUCT_ID>
Content-Type: application/json
```

```json
{
  "name": "Keyboard Pro",
  "price": 150,
  "category": "Accessories"
}
```

#### DELETE

```http
DELETE http://localhost:3001/products/<PRODUCT_ID>
```

### Category

```http
GET    http://localhost:3001/categories
POST   http://localhost:3001/categories/add
PUT    http://localhost:3001/categories/<CATEGORY_ID>
DELETE http://localhost:3001/categories/<CATEGORY_ID>
```

POST body:

```json
{
  "name": "Accessories",
  "description": "Computer accessories"
}
```

## 12. Luồng thực thi

Ví dụ `GET /products`:

```text
1. Postman gửi GET /products
2. bin/www nhận request qua HTTP server
3. Express app nhận request
4. app.use("/products", productsRouter) khớp URL
5. router.use() kiểm tra database và tạo ProductModel
6. next() chuyển request tới router.get("/")
7. Route gọi await req.productModel.getAll()
8. Model gọi collection.find({}).toArray()
9. MongoDB trả array
10. Route gửi res.status(200).json(products)
```

Ví dụ `POST /products/add`:

```text
JSON body
  ↓ express.json()
req.body
  ↓ ProductModel.add(req.body)
insertOne()
  ↓
result.insertedId
  ↓
201 JSON response
```

## 13. Kiến thức cần nắm

### Router và route handler

- Router nhóm các endpoint của cùng resource.
- Route handler là function thực sự xử lý một method và đường dẫn.

```js
router.get("/", async (req, res, next) => {
  // Đây là route handler.
});
```

### Middleware và `next()`

Middleware có cơ hội:

- Đọc hoặc sửa `req`.
- Gửi response sớm.
- Gọi `next()` để chuyển quyền xử lý.

Nếu middleware không gửi response và không gọi `next()`, request bị treo.

### `async/await`

- MongoDB methods trả Promise.
- `await` nhận kết quả fulfilled.
- Promise rejected được bắt bởi `catch`.
- `next(error)` chuyển lỗi cho error middleware.

### `ObjectId`

URL parameter là string:

```js
req.params.id;
```

MongoDB `_id` thường là `ObjectId`, nên model chuyển đổi:

```js
new ObjectId(id);
```

Kiểm tra trước:

```js
ObjectId.isValid(id);
```

### CRUD mapping

| CRUD | HTTP | MongoDB Driver |
|---|---|---|
| Create | POST | `insertOne()` |
| Read | GET | `find()`, `findOne()` |
| Update | PUT | `updateOne()` + `$set` |
| Delete | DELETE | `deleteOne()` |

### Status code

| Status | Ý nghĩa |
|---|---|
| `200` | Request thành công |
| `201` | Tạo resource thành công |
| `400` | Client gửi dữ liệu/ID sai |
| `404` | Không tìm thấy resource |
| `500` | Lỗi không dự kiến trong server |
| `503` | Database hoặc dịch vụ phụ thuộc chưa sẵn sàng |

## 14. Lỗi thường gặp

### Sai tên file model

File thực tế:

```text
models/Product.js
```

Thì phải dùng:

```js
require("../models/Product");
```

Tên class `ProductModel` không quyết định đường dẫn file.

### Truyền sai giá trị cho MongoClient

```js
// Sai
new MongoClient(process.env.DB_NAME);

// Đúng
new MongoClient(process.env.MONGODB_URI);
```

### Quên export

```js
module.exports = ProductModel;
```

hoặc:

```js
module.exports = router;
```

### Quên mount router

```js
app.use("/products", productsRouter);
```

### Mount router sau 404

Router phải nằm trước:

```js
app.use((req, res, next) => {
  next(createError(404));
});
```

### Quên `await`

```js
// Sai: products là Promise
const products = req.productModel.getAll();

// Đúng: products là array
const products = await req.productModel.getAll();
```

### Port đã được sử dụng

```text
Port 3001 is already in use
```

Dừng server cũ bằng `Ctrl + C` hoặc đổi `PORT` trong `.env`.

## 15. Cần nhớ và không cần học thuộc

### Cần nhớ

Trình tự:

```text
Generate
→ Install
→ .env
→ Connect MongoDB
→ Model
→ Router
→ Mount
→ Postman
```

Cần tự viết được:

```js
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
app.locals.db = client.db(process.env.DB_NAME);
```

```js
constructor(database) {
  this.collection = database.collection("products");
}
```

```js
router.get("/", async (req, res, next) => {
  try {
    const data = await req.productModel.getAll();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});
```

### Không cần học thuộc

- Toàn bộ boilerplate trong `bin/www`.
- Nội dung `package-lock.json`.
- Phiên bản chính xác của package.
- Từng câu message JSON.
- Tất cả option của Express Generator.
- Toàn bộ Product và Category riêng biệt; cần hiểu pattern để áp dụng lại.

## 16. Checklist code lại

- [ ] Generate project bằng Express Generator.
- [ ] Cài `mongodb` và `dotenv`.
- [ ] Tạo `.env`.
- [ ] Kết nối MongoDB.
- [ ] Lưu database vào `app.locals.db`.
- [ ] Tạo `models/Product.js`.
- [ ] Viết `getAll()` và test GET trước.
- [ ] Viết `add()` và test POST.
- [ ] Viết `update()` và test PUT.
- [ ] Viết `delete()` và test DELETE.
- [ ] Tạo Product Router.
- [ ] Mount `/products` trước middleware 404.
- [ ] Áp dụng lại pattern cho Category.
- [ ] Test toàn bộ endpoint bằng Postman.

## 17. Câu hỏi tự kiểm tra

1. `app.js` và `bin/www` khác nhau thế nào?
2. Tại sao không truyền `DB_NAME` vào `MongoClient`?
3. `process.env` chứa gì?
4. `app.locals.db` dùng để làm gì?
5. Router lấy database bằng cách nào?
6. Constructor của ProductModel chạy khi nào?
7. Constructor có thực hiện truy vấn không?
8. `find({})` trả về array hay cursor?
9. `toArray()` làm gì?
10. `async function` luôn trả về gì?
11. `await` nhận giá trị từ đâu?
12. Vì sao gắn `productModel` vào `req`?
13. Nếu quên `next()`, request sẽ thế nào?
14. `req.body` được tạo bởi middleware nào?
15. `req.params.id` có kiểu dữ liệu gì?
16. Vì sao cần `ObjectId.isValid()`?
17. `insertOne()` trả ID mới qua property nào?
18. `$set` có tác dụng gì?
19. `matchedCount` và `modifiedCount` khác nhau thế nào?
20. Vì sao phải mount router trước middleware 404?

---

## Tài liệu chính thức

- [Express Generator](https://expressjs.com/en/starter/generator.html)
- [Express middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Express routing](https://expressjs.com/en/guide/routing.html)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB CRUD operations](https://www.mongodb.com/docs/drivers/node/current/crud/)
