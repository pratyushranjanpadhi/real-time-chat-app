const socket = io();

const $mainForm = document.querySelector(".form");
const $mainFormInput = $mainForm.querySelector("input");
const $mainFormButton = $mainForm.querySelector("button");
const $locationButton = document.querySelector(".location");
const $messages = document.querySelector(".message-area");
//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const usernameTemplate = document.querySelector("#username-template").innerHTML;
const roomTemplate = document.querySelector("#room-template").innerHTML;
const myMessageTemplate = document.querySelector("#my-message-template").innerHTML;

//Query string parser
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

//Autoscroll function description
const autoScroll = () => {
   const $newMessage = $messages.lastElementChild;
   const newMessageHeight = $newMessage.offsetHeight + parseInt(getComputedStyle($newMessage).marginBottom);
   const visibleHeight = $messages.offsetHeight;
   const containerHeight = $messages.scrollHeight;
   const scrollOffset = $messages.scrollTop + visibleHeight;

   if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight;
   }
   return;
};

//Message listener
socket.on("message", (messageObject) => {
   const html = Mustache.render(messageTemplate, {
      username: messageObject.username,
      message: messageObject.text,
      timeStamp: moment(messageObject.time).format("h:mm A"),
   });
   $messages.insertAdjacentHTML("beforeend", html);
});

//Location listener
socket.on("locationData", (locationData) => {
   const html = Mustache.render(locationMessageTemplate, {
      username: locationData.username,
      mapdata: locationData.url,
      timeStamp: moment(locationData.time).format("h:mm A"),
   });
   $messages.insertAdjacentHTML("beforeend", html);
});

//sidebar users and room details listener
socket.on("roomData", ({ room, users }) => {
   const html = Mustache.render(usernameTemplate, {
      users: users,
   });
   document.querySelector(".online-members").innerHTML = html;
   const html2 = Mustache.render(roomTemplate, {
      room: room,
   });
   document.querySelector(".room").innerHTML = html2;
});

//Form data sending code or message sending code
$mainForm.addEventListener("submit", (e) => {
   e.preventDefault();

   $mainFormButton.setAttribute("disabled", "disabled");
   const message = $mainFormInput.value;

   //Appending my message to the right without sending it to me(handlilng it on the front-end side )
   const myHtml = Mustache.render(myMessageTemplate, {
      message: message,
      username: username,
      timeStamp: moment(new Date().getTime()).format("h:mm A"),
   });
   $messages.insertAdjacentHTML("beforeend", myHtml);

   socket.emit("chatMessage", message, (msg) => {
      $mainFormButton.removeAttribute("disabled");
      $mainFormInput.value = "";
      $mainFormInput.focus();
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
