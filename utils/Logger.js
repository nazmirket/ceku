const { appendFile, open } = require('fs').promises
const { existsSync } = require('fs')

module.exports = async function (script, message, status) {
	const logFile = [process.cwd(), 'logs', `${script}.log`].join('/')

	// create log file if it doesn't exist
	await touch(logFile)

	// compose log message
	const log = `${[status, new Date().toISOString(), message].join('   ')}\n`

	await appendFile(logFile, log)
}

async function touch(file) {
	if (existsSync(file)) return
	await open(file, 'w')
}
