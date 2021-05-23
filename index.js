const server = require("http").createServer();
// const server = require("https").createServer();
// const axios = require('axios');
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;
// const APIURL = ""
let lastSave = new Date();
let dataReceived = [];
let dataToSave = [];

io.on("connection", (socket) => {
    let roomId;

    socket.on('room', (currentRoom) => {
      console.log('on room', currentRoom);
        roomId = currentRoom;
        socket.join(currentRoom);
    });

  socket.on('NEW_MESSAGE_FROM_CHAT', (msg) => {
    //metodo que salva via backend, podera ser utilizado futuramente.
    // verifyTime(msg);
    if(roomId === undefined) {
      roomId = msg.room;
      socket.join(roomId);
    }
      let m = {
        "moment": msg.moment,
        "idUser":msg.userid || 0,
        "user": msg.user,
        "message": msg.message
      }
      io.to(msg.room || roomId).emit('NEW_MESSAGE_FROM_SERVER', m);
  });

  socket.on("disconnect", () => {
    console.log('desconectou');
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Chat backend listening on port ${PORT}`);
});

async function verifyTime(msg) {
  const d = new Date();

  if(msg && msg.room) {
    if(!dataReceived[msg.room]){
      dataReceived[msg.room] = { "date" : d, "messages" : [] };
    }
  }
  dataReceived[msg.room]["messages"].push(msg);
  console.log("room", dataReceived[msg.room]);

  if(d > lastSave) {
    dataToSave = dataReceived;
    dataReceived = [];
    for(let i=0; i < dataToSave.length; i++)
    {
      await saveChat();
    }
    lastSave.setMinutes(lastSave.getMinutes() + 30);
    console.log("lastSave :", lastSave);
  }
}

async function saveChat(room, roomData) {
  axios
    .post(`${URl}/chat/savemessageroom/${room}`, {
      data: roomData
    })
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
    })
    .catch(error => {
      console.error(error)
    })
}