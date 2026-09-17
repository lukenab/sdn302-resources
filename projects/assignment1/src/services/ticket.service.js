import { parseObjectId } from "../utils/object-id.js";

export class TicketService{
    constructor(ticketModel){
        this.ticketModel = ticketModel;
    }

    async getTicketsByUser(id){
        const userId = parseObjectId(id, "userId");

        return this.ticketModel.findByUserId(userId);
    }

    async getAvailableTickets(){
        return this.ticketModel.findAvailable();
    }
}