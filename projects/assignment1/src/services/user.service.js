import { parseObjectId } from "../utils/object-id.js";
import { AppError } from "../errors/app-error.js";

export class UserService {
  constructor(userModel, ticketModel) {
    this.userModel = userModel;
    this.ticketModel = ticketModel;
  }

  async updateVipStatus(id, isVIP) {
    const userId = parseObjectId(id, "userId");

    if (typeof isVIP != "boolean") {
      throw new AppError(400, "isVIP must be a boolean.", "INVALID_VIP_STATUS");
    }

    const updatedUser = await this.userModel.updateVipStatus(userId, isVIP);
    if (!updatedUser) {
      throw new AppError(404, "User not found!", "USER_NOT_FOUND.");
    }

    return updatedUser;
  }

  async deleteUserTickets(id) {
    const userId = parseObjectId(id, "userId");

    const user = await this.userModel.findById(userId);
    if(!user){
        throw new AppError(404, "User not found.", "USER_NOT_FOUND.")
    }

    const deleteResult = await this.ticketModel.deleteByUserId(userId);
    await this.userModel.clearTickets(userId);

    return{
        deleteTickets: deleteResult.deletedCount,
    }

  }
}
