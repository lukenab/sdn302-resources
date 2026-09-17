const rooms = [
  {
    id: 1,
    name: "Meeting Room A",
    available: true,
  },
  {
    id: 2,
    name: "Meeting Room B",
    available: true,
  },
  {
    id: 3,
    name: "Conference Room",
    available: false,
  },
];

function findRoomById(roomId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const room = rooms.find(
        (currentRoom) => currentRoom.id === roomId
      );

      if (!room) {
        reject(new Error(`Room ${roomId} was not found`));
        return;
      }

      resolve(room);
    }, 1000);
  });
}

function checkRoomAvailability(room) {
  return new Promise((resolve, reject) => {
    console.log(`Checking ${room.name}...`);

    setTimeout(() => {
      if (!room.available) {
        reject(new Error(`${room.name} is unavailable`));
        return;
      }

      resolve(room);
    }, 1000);
  });
}

function createBooking(room, userId) {
  return new Promise((resolve, reject) => {

    setTimeout(() => {
      if (!userId) {
        reject(new Error("User ID is required"));
        return;
      }

      const booking = {
        bookingId: Date.now(),
        userId,
        roomId: room.id,
        status: "confirmed",
      };

      resolve(booking);
    }, 1000);
  });
}

async function createRoomBooking(roomId, userId) {
  const room = await findRoomById(roomId);

  const availableRoom = await checkRoomAvailability(room);

  const booking = await createBooking(availableRoom, userId);

  return booking;
}

async function main() {
  try {
    const booking = await createRoomBooking(2, 101);

    console.log("Booking created:", booking);
  } catch (error) {
    console.error("Booking failed:", error.message);
  } finally {
    console.log("Booking workflow finished");
  }
}

main();
