const Logger = require('./Logger')

module.exports = (f, label) =>
  f()
    .then(async (message) => {
      if (label) await Logger(label, message, 'OK')
      process.exit(0)
    })
    .catch(async (e) => {
      if (label) await Logger(label, e.message, 'ERROR')
      process.exit(1)
    })
