const socket = io();

socket.on("message", (message) => {
   console.log(message);
});

document.querySelector("#mainForm").addEventListener("submit", (e) => {
   e.preventDefault();

   const message = document.querySelector("input").value;
   socket.emit("chatMessage", message);
});
