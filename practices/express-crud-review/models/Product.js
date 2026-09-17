const { ObjectId } = require("mongodb");

class ProductModel {
  constructor(database) {
    // Chọn collection products một lần khi model được tạo.
    this.collection = database.collection("products");
  }

  async getAll() {
    // find({}) tạo cursor; toArray() đọc cursor thành một mảng.
    return this.collection.find({}).toArray();
  }

  async getById(id) {
    return this.collection.findOne({
      _id: new ObjectId(id),
    });
  }

  async add(product) {
    const result = await this.collection.insertOne(product);

    // Driver mới trả ID qua insertedId, không còn dùng result.ops[0].
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
