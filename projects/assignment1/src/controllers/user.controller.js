// export function createUserController(userService) {
//   async function updateVipStatus(req, res) {
//     const { id } = req.params;
//     const { isVIP } = req.body;

//     const user = await userService.updateVipStatus(id, isVIP);

//     return res.status(200).json({
//       message: "User vip status updated.",
//       data: user,
//     });
//   }

//   async function deleteUserTickets(req, res) {
//     const userId = req.params;

//     const result = await userService.deleteUserTickets(userId);

//     return res.status(200).json({
//       message: "Success",
//       data: result,
//     });
//   }

//   // Trả về object chưa hai function để router sử dụng
//   return {
//     updateVipStatus,
//     deleteUserTickets,
//   };
// }

export function createUserController(userService) {
  async function updateVipStatus(req, res) {
    const { id } = req.params;
    const { isVIP } = req.body;

    const user = await userService.updateVipStatus(id, isVIP);

    return res.status(200).json({
      message: "Update vip status successfully.",
      data: user,
    });
  }

  async function deleteUserTickets(userId) {
    const { id } = req.params;

    const result = await userService.deleteUserTickets(userId);

    return res.status(200).json({
      message: "success",
      data: result,
    });
  }

  return {
    updateVipStatus,
    deleteUserTickets,
  };
}
