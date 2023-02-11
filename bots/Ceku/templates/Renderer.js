const { readFile } = require('fs').promises
const handlebars = require('handlebars')

module.exports = async function (name, context) {
  const file = [__dirname, `${name}.hbs`].join('/')
  const source = await readFile(file, 'utf8')
  const template = handlebars.compile(source)
  return template(context)
}
