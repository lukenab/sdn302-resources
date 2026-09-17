const rooms = [
  {
    id: 1,
    name: "Meeting Room A",
    capacity: 4,
    available: true,
  },
  {
    id: 2,
    name: "Meeting Room B",
    capacity: 10,
    available: true,
  },
  {
    id: 3,
    name: "Conference Room",
    capacity: 20,
    available: false,
  },
];

function findRoomById(roomId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const room = rooms.find((currentRoom) => currentRoom.id === roomId);
      if (!room) {
        reject(new Error(`Room with ID ${roomId} was not found!`));
        return;
      }

      resolve(room);
    }, 1000);
  });
}

function checkRoomAvailability(room) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!room.available) {
        reject(new Error("Room is unavailable!"));
        return;
      }

      resolve(room);
    }, 1000);
  });
}

function createBooking(room, userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booking = {
        bookingId: Date.now(),
        userId: userId,
        roomId: room.id,
        status: "confirmed",
      };
      resolve(booking);
    }, 1000);
  });
}

findRoomById(2)
  .then((room) => {
    return checkRoomAvailability(room);
  })
  .then((availableRoom) => {
    return createBooking(availableRoom, 101);
  })
  .then((booking) => {
    console.log("Booking finder: ", booking);
  })
  .catch((error) => {
    console.log(`Error: `, error.message);
  });
