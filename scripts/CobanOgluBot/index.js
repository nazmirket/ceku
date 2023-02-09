const Response = require('./src/Response')
const Database = require('./src/Database')

async function start() {
   await Response.init()
   await Database.init()
   require('./src/Bot')
}

start()
