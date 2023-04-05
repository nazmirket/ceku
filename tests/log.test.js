const Logger = require('../utils/Logger')

async function test() {
	await Logger('test', 'test', 'OK')
}

test()
