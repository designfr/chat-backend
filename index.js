const server = require("http").createServer();
// const server = require("https").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;

io.on("connection", (socket) => {
    let roomId;

    socket.on('room', function(room) {
        roomId = room;
        socket.join(room);
    });

  socket.on('NEW_MESSAGE_FROM_CHAT', (data) => {
    console.log('m: ', data);
      let m = {
        "moment": data.moment,
        "user": data.user,
        "message": data.message,
        "room": data.room
      }
      io.to(roomId).emit('NEW_MESSAGE_FROM_SERVER', m);
  });

  socket.on("disconnect", () => {
      console.log('desconectou');
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Chat backend listening on port ${PORT}`);
});