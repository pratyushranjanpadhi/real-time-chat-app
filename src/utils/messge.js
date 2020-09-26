const generateMessage = (text, username) => {
   return {
      username: username,
      text: text,
      time: new Date().getTime,
   };
};

const generatLocationeMessage = (url, username) => {
   return {
      username: username,
      url: url,
      time: new Date().getTime,
   };
};

module.exports = { generateMessage, generatLocationeMessage };
