const { readdir, readFile } = require('fs/promises')
const { spawn } = require('child_process')

const Scheduler = require('./utils/Scheduler')

// run a script with given name
async function run(script) {
   // compose a path to the script
   const path = [process.cwd(), 'scripts', script, 'index.js'].join('/')

   // spawn a new process
   const pr = spawn('node', [path], { detached: true })
   pr.unref()
}

// get all script names and their schedule information
async function getScripts() {
   // get the scripts directory
   const root = [process.cwd(), 'scripts'].join('/')

   // read the directory
   const files = (await readdir(root, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)

   return Promise.all(
      files.map(async function (script) {
         const scPath = [root, script, 'schedule.json'].join('/')
         const schedule = JSON.parse(await readFile(scPath, 'utf-8'))
         return { script, schedule }
      })
   )
}

// initialize the scheduler
async function init() {
   // get all scripts
   const scripts = await getScripts()

   // register the scripts
   scripts.forEach(({ script, schedule }) => {
      // parse the schedule
      const { type, interval } = schedule
      // schedule the script
      Scheduler[type](() => run(script), interval)
   })

   process.stdin.on('data', console.log)
   process.stderr.on('data', console.error)
}

init()
