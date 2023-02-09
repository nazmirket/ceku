const Configs = require('../configs.json')
const TelegramBot = require('node-telegram-bot-api')

const History = require('./History')

const Bot = new TelegramBot(Configs.TOKEN, { polling: true })
const Commands = require('./Commands')

const Response = require('./Response')
const Service = require('./Service')

for (const command of Commands) {
   Bot.onText(command.regex, async function (message, match) {
      const chatId = message.chat.id
      const sender = message.from

      // if command is protected, check if user is confirmed
      if (command.protect) {
         const confirmed = await Service.isConfirmed(sender)
         if (!confirmed) {
            await respond(chatId, Response.prepared.notConfirmed())
            return
         }
      }

      // if command is continuable, set it as current command and ask first question
      if (command.cont) {
         History.init(chatId, command)
         await Bot.sendMessage(chatId, command.props[0].q)
      }

      // if command is not continuable, execute it
      else {
         History.clear(chatId)
         try {
            const res = await command.action(match, sender)
            await respond(chatId, res)
         } catch (e) {
            await Bot.sendMessage(chatId, e.message)
         }
      }
   })
}

Bot.on('text', async function (message) {
   // check if command and stop if so
   const isCommand = /^\/.*$/.test(message.text)
   if (isCommand) return

   const chatId = message.chat.id

   // get current chat
   const chat = History.get(chatId)

   // get current command
   const command = chat ? chat.getCommand() : null

   // if command is not continuable, return
   if (!command) return

   const step = chat.propLength()

   // get current question
   const prop = command.props[step]

   // if question is not defined, return
   if (!prop) return

   // validate answer
   const validationResponse = prop.validate(message.text)

   // if answer is not valid, ask again
   if (validationResponse !== true) {
      await Bot.sendMessage(chatId, validationResponse)
      return
   }

   // if answer is valid, save it
   chat.setProp(prop.key, prop.transform(message.text))

   // if there are more questions, ask next question
   if (command.props.length > step + 1) {
      await Bot.sendMessage(chatId, command.props[step + 1].q)
      return
   }

   // if there are no more questions, execute command
   const sender = message.from

   try {
      const res = await command.action(chat.props, sender)
      await respond(chatId, res)
   } catch (e) {
      await Bot.sendMessage(chatId, e.message)
   }
})

async function respond(chatId, { type, data }) {
   if (type === 'gif') await Bot.sendAnimation(chatId, data)
   if (type === 'vid') await Bot.sendVideo(chatId, data)
   if (type === 'html')
      await Bot.sendMessage(chatId, data, { parse_mode: 'HTML' })
   else await Bot.sendMessage(chatId, data)
}
