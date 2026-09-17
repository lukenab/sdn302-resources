const rooms = [
  {
    id: 1,
    name: "Meeting room A",
    capacity: 4,
    available: true,
  },
  {
    id: 2,
    name: "Meeting room B",
    capacity: 10,
    available: true,
  },
  {
    id: 3,
    name: "Conference",
    capacity: 20,
    available: false,
  },
];

function findRoomById(roomId, callback){
  console.log(`Searching for room with ID: ${roomId}`)

  const room = rooms.find(currentRoom => currentRoom.id === roomId)
  if(!room){
    const error = new Error(`Room not found with ID: ${roomId}`)
    callback(error, null);
    return;
  }
}

function findRoomById(roomId, callback){
  console.log(`Searching for room with ID: ${roomId}`)

  const room = rooms.find(currentRoom => currentRoom.id === roomId);
  if(!room){
    const error = new Error(`Room not found with ID: ${roomId}`)
    return callback(error, null);
  }

  callback(null, room);
}

findRoomById(2, (error, room) => {
  if(error){
    console.error("Error: ", error)
    return;
  }

  console.log("Room found: ", room)
})