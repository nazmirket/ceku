const Response = require('./src/Response')
const Database = require('./src/Database')

module.exports.start = async () => {
   await Response.init()
   await Database.init()
   require('./src/Bot')
}
