module.exports = (f) =>
   f()
      .then(() => {
         console.log('Done!')
         process.exit(0)
      })
      .catch((e) => {
         console.log('Error!', e)
         process.exit(1)
      })
