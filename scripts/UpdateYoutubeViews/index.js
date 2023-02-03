const TaskConfig = require('./configs.json')
const Runner = require('../../utils/Runner')

const Counter = require('./src/counter')

Runner(async () => {
   await Counter(TaskConfig.VIDEO_ID)
})
