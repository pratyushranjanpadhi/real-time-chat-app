const socket = io();

// //DOM elements variables
// const $mainForm = document.querySelector("#mainForm");
// const $mainFormInput = $mainForm.querySelector("input");
// const $mainFormButton = $mainForm.querySelector("button");
// const $locationButton = document.querySelector("#location-button");
// const $messages = document.querySelector("#messages");
// //Templates
// const messageTemplate = document.querySelector("#message-template").innerHTML;
// const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
// const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//DOM elements variables
const $mainForm = document.querySelector(".form");
const $mainFormInput = $mainForm.querySelector("input");
const $mainFormButton = $mainForm.querySelector("button");
const $locationButton = document.querySelector(".location");
const $messages = document.querySelector(".main-chat");
//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const roomTemplate = document.querySelector("room-template").innerHTML;

//Query string parser
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

//Message listener
socket.on("message", (messageObject) => {
   const html = Mustache.render(messageTemplate, {
      username: messageObject.username,
      message: messageObject.text,
      timeStamp: moment(messageObject.time).format("h:mm A"),
   });
   $messages.insertAdjacentHTML("beforeend", html);
   console.log(messageObject.text, messageObject.username);
});

//Location listener
socket.on("locationData", (locationData) => {
   const html = Mustache.render(locationMessageTemplate, {
      username: locationData.username,
      mapdata: locationData.url,
      timeStamp: moment(locationData.time).format("h:mm A"),
   });
   $messages.insertAdjacentHTML("beforeend", html);
   console.log(locationData.url.locationData.username);
});

//sidebar users and room details listener
socket.on("roomData", ({ room, users }) => {
   const html = Mustache.render(sidebarTemplate, {
      users: users,
   });
   document.querySelector(".online-members").innerHTML = html;
   const html2 = Mustache.render(roomTemplate, {
      room: room,
   });
   document.querySelector(".room").innerHTML = html2;
   console.log(room, users);
});

//Form data sending code or message sending code
$mainForm.addEventListener("submit", (e) => {
   e.preventDefault();

   $mainFormButton.setAttribute("disabled", "disabled");
   const message = $mainFormInput.value;

   socket.emit("chatMessage", message, (msg) => {
      $mainFormButton.removeAttribute("disabled");
      $mainFormInput.value = "";
      $mainFormInput.focus();

      console.log(msg);
   });
});

//Location sending code
$locationButton.addEventListener("click", () => {
   if (!navigator.geolocation) {
      return alert("Your browser does not support this functionality");
   }

   $locationButton.setAttribute("disabled", "disabled");

   navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      socket.emit("location", lat, lon, () => {
         console.log("Location Shared");
         $locationButton.removeAttribute("disabled");
      });
   });
});

//Joining room sending code
socket.emit("join", { username, room }, (error) => {
   if (error) {
      location.href = "/";
      return alert(error);
   }
});
