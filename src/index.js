// All imports
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { generateMessage, generatLocationeMessage } = require("./utils/messge");
const { addUser, removeUser, getUser, getAllUsers } = require("./utils/users");

// all setups
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// all variables
const port = process.env.PORT || 3000;
const directoryPath = path.join(__dirname, "../public");

// all functioning method(Socket.io)
io.on("connection", (socket) => {
   console.log("web socket connection established");

   socket.on("join", ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });
      socket.join(room);
      if (error) {
         return callback(error);
      }
      socket.join(user.room);
      socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined`, user.username));

      //sidebar room and users display
      io.to(user.room).emit("roomData", {
         room: user.room,
         users: getAllUsers(user.room),
      });
      callback();
   });

   socket.emit("message", generateMessage("welcome", "Admin"));

   socket.on("chatMessage", (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit("message", generateMessage(message, user.username));
      callback("delivered");
   });

   socket.on("location", (lat, lon, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit("locationData", generatLocationeMessage(`https://google.com/maps?q=${lat},${lon}`, user.username));
      callback();
   });

   socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
         socket.to(user.room).emit("message", generateMessage(`${user.username} has left`));
      }
   });
});

//middleware functionn
app.use(express.static(directoryPath));

//port details
server.listen(port, () => {
   console.log("server is up on port 3000");
});
