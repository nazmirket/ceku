/* eslint-disable n/no-process-exit */
const Logger = require('./Logger')

module.exports = async (f, label) => {
	try {
		const message = await f()
		await Logger(label, message, 'OK')
	} catch (e) {
		await Logger(label, e.message, 'ERROR')
	}
}
