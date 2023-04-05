const TaskConfig = require('./configs.json')
const Runner = require('../../utils/Runner')

const Counter = require('./src/counter')

const Scheduler = require('../../utils/Scheduler')

// initialize the scheduler
async function init() {
	Scheduler.cycle(function () {
		Runner(
			() =>
				Counter(TaskConfig.VIDEO_ID)
					.then(() => 'Updated Youtube Views Successfully')
					.catch(e => e.message),
			'UpdateYoutubeViews'
		)
	}, 30)
}

init()
