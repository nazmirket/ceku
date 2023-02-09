const Chat = require('./Chat')

const chats = {}

function id(chatId) {
   return ['C', chatId].join(':')
}

module.exports.init = (chatId, command) => {
   chats[id(chatId)] = new Chat(id(chatId), command)
}

module.exports.clear = (chatId) => {
   chats[id(chatId)] = null
}

module.exports.get = (chatId) => {
   return chats[id(chatId)]
}
