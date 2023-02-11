const schedule = require('node-schedule')

module.exports = {
  // Returns a list of all scheduled jobs
  list () {
    return schedule.scheduledJobs
  },
  // Registers an action to run in a daily basis
  daily: (action, time) => {
    const { h, m } = time
    const job = schedule.scheduleJob(`${m} ${h} * * *`, action)
    return job
  },
  // Registers an action to run in a weekly basis
  weekly: (action, time) => {
    const { h, m, d } = time
    const job = schedule.scheduleJob(`${m} ${h} * * ${d}`, action)
    return job
  },
  // Registers an action to run periodically
  periodic: (action, interval) => {
    // interval is an object with h, m, s
    const { h = 0, m = 0, s = 0 } = interval
    // convert to seconds
    const seconds = s + m * 60 + h * 60 * 60
    // create a rule
    const rule = new schedule.RecurrenceRule()
    // set the seconds
    rule.second = seconds
    // schedule the job
    schedule.scheduleJob(rule, action)
  }
}
