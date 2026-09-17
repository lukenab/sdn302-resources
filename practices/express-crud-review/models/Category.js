const { ObjectId } = require("mongodb");

class CategoryModel {
  constructor(database) {
    // CategoryModel làm việc với collection categories.
    this.collection = database.collection("categories");
  }

  async getAll() {
    return this.collection.find({}).toArray();
  }

  async getById(id) {
    return this.collection.findOne({
      _id: new ObjectId(id),
    });
  }

  async add(category) {
    const result = await this.collection.insertOne(category);

    return {
      ...category,
      _id: result.insertedId,
    };
  }

  async update(id, category) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: category },
    );
  }

  async delete(id) {
    return this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = CategoryModel;
