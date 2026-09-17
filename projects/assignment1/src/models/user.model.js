export class UserModel {
  constructor(database) {
    this.collection = database.collection("users");
  }

  async findById(userId) {
    return this.collection.findOne({ _id: userId });
  }

  async updateVipStatus(userId, isVIP) {
    return this.collection.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          // $set chỉ cập nhật các field được chỉ định
          isVIP,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after", // yêu cầu mongodb trả về document sau khi cập nhật
        includeResultMetadata: false,
      },
    );
  }

  async clearTickets(userId) {
    return this.collection.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          tickets: [],
          updatedAt: new Date(),
        },
      },
    );
  }
}
