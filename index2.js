const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;
const NEW_CHAT_MESSAGE_EVENT = 'chat'; 

io.on("connection", (socket) => {
    console.log('id: ', socket.id);
    console.log('query: ', socket.handshake.query);
  
  // Join a conversation
  const roomId = '1'; //socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on('NEW_MESSAGE_FROM_CHAT', (data) => {
      console.log('a', data)
      let m = {
        "moment": data.moment,
        "user": data.user,
        "message": data.message,
        "room": data.room
      }
      io.to(roomId).emit('NEW_MESSAGE_FROM_SERVER', m);
    // io.in(roomId).emit('NEW_MESSAGE_FROM_CHAT', m);
  });

  // socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
      //chamar o salvar sala aqui
      console.log('desconectou');
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});