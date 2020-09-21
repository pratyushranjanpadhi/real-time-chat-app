// All imports
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// all setups
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// all variables
const port = process.env.PORT || 3000;
const directoryPath = path.join(__dirname, "../public");

// all functioning method
io.on("connection", (socket) => {
   console.log("web socket connection established");
   socket.on("chatMessage", (message) => {
      io.emit("message", message);
   });
});

app.use(express.static(directoryPath));

server.listen(port, () => {
   console.log("server is up on port 3000");
});
