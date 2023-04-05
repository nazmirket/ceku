const CronJob = require('cron').CronJob

module.exports.cycle = function (f) {
	new CronJob('30 * * * * *', f, null, true).start()
}
