import express from "express";

const app = express();

const rooms = [
  {
    id: 1,
    name: "A101",
    capacity: 2,
    available: true,
  },
  {
    id: 2,
    name: "A102",
    capacity: 4,
    available: false,
  },
];

app.use(express.json());

app.use();

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.get("/rooms", (req, res) => {
  return res.status(200).json({
    count: rooms.length,
    data: rooms,
  });
});

app.get("/rooms/:id", (req, res) => {
  const roomId = req.params.id;
  if (!Number.isInteger(roomId) || roomId <= 0) {
    return res.status(400).json({
      message: "RoomID must be a positive integer",
    });
  }

  const room = rooms.find((currentRoom) => currentRoom.id === roomId);
  if (!room) {
    return res.status(404).json({
      message: "Room not found!",
    });
  }

  return res.status(200).json({
    data: room,
  });
});

export default app;
