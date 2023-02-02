const axios = require('axios').default
const instance = axios.create({ timeout: 20000 })
module.exports = instance
