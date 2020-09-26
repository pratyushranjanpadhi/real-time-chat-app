const users = [];

//1.addUser function details
const addUser = ({ id, username, room }) => {
   //reformatting the input values
   username = username.trim().toLowerCase();
   room = room.trim().toLowerCase();

   //Input validation
   if (!username || !room) {
      return {
         error: "User Name and Room must be provided",
      };
   }

   //checking for an existing user
   const existingUser = users.find((user) => {
      return user.username === username && user.room === room;
   });
   if (existingUser) {
      return {
         error: "User already exist",
      };
   }

   //adding user to the array
   const user = { id, username, room };
   users.push(user);
   return { user };
};

//2.removeUser function details
const removeUser = (id) => {
   const index = users.findIndex((user) => {
      return user.id === id;
   });
   if (index !== -1) {
      return users.splice(index, 1)[0];
   }
};

//3.getUser function details
const getUser = (id) => {
   const user = users.find((user) => {
      return user.id === id;
   });
   return user;
};

//4.getAllUsers function details
const getAllUsers = (room) => {
   const newUsers = users.filter((user) => {
      return user.room === room;
   });
   return newUsers;
};

module.exports = {
   addUser,
   removeUser,
   getUser,
   getAllUsers,
};
