export function createTicketController(ticketService) {
  async function getTicketsByUser(req, res) {
    const { userId } = req.params;

    const tickets = await ticketService.getTicketsByUser(userId);

    return res.status(200).json({
      data: tickets,
    });
  }

  async function getAvailableTickets(_req, res) {
    const tickets = await ticketService.getAvailableTickets();

    return res.status(200).json({
      data: tickets,
    });
  }

  return {
    getTicketsByUser,
    getAvailableTickets,
  };
}
