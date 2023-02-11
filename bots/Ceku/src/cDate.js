module.exports = function (d) {
  const date = new Date(d)
  const day = date.getDate()
  const month = date.toLocaleString('tr-TR', { month: 'long' })

  return `${day} ${month}`
}
