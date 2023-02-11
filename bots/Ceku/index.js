const Response = require('./src/Response')
const Database = require('./src/Database');

(async () => {
  await Response.init()
  await Database.init()
  require('./src/Bot')
})()
