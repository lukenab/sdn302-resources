export class TicketModel {
  constructor(database) {
    this.collection = database.collection("tickets");
  }

  async findByUserId(userId) {
    return this.collection.find({ userId }).sort({ showTime: 1 }).toArray();
  }

  async findAvailable() {
    return this.collection
      .find({
        userId: null,
      })
      .sort({ showTime: 1 })
      .toArray();
  }

  async deleteByUserId(userId) {
    return this.collection.deleteMany({ userId });
  }
}
