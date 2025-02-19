//Node server which will handle soket io connection
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    // console.log("New user",name)

    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    // No parameter needed here
    if (users[socket.id]) {
      socket.broadcast.emit("left", users[socket.id]); // Notify others
      console.log(`${users[socket.id]} has left the chat.`);
      delete users[socket.id]; // Remove user from the list
    }
  });
});
