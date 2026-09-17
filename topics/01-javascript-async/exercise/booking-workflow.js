const rooms = [
  { id: 1, name: 'Alpha', available: true, hourlyPrice: 100 },
  { id: 2, name: 'Beta', available: false, hourlyPrice: 150 }
];

export function findRoomWithCallback(roomId, callback) {
  // TODO 1:
  // Wait 100 ms, then find a room by id.
  // Call callback(new Error('Room not found')) when it does not exist.
  // Call callback(null, room) when it exists.
  throw new Error('TODO: implement findRoomWithCallback');
}

export function findRoom(roomId) {
  // TODO 2:
  // Return a Promise.
  // Wait 100 ms, then resolve with the matching room.
  // Reject with Error('Room not found') when it does not exist.
  throw new Error('TODO: implement findRoom');
}

export async function createBooking(roomId, hours) {
  // TODO 3:
  // Validate that hours is greater than 0.
  // Await findRoom(roomId).
  // Throw Error('Room is unavailable') when necessary.
  // Return { roomId, roomName, hours, totalPrice }.
  throw new Error('TODO: implement createBooking');
}
