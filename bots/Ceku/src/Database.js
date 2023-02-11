const { Sequelize } = require('sequelize')

const DatabaseFile = [process.cwd(), 'data', 'Home.sqlite'].join('/')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DatabaseFile
})

const { Donation, Expense, Payment, User } = require('./Schemas')

module.exports = {
  init: async function () {
    await sequelize.authenticate()

    sequelize.define('User', User)

    sequelize.define('Expense', Expense, {
      timestamps: true
    })

    sequelize.define('Payment', Payment, {
      timestamps: true
    })

    sequelize.define('Donation', Donation, {
      timestamps: true
    })

    sequelize.models.Expense.hasOne(sequelize.models.Payment, {
      foreignKey: 'expense',
      as: 'payment'
    })

    sequelize.models.User.hasMany(sequelize.models.Payment, {
      foreignKey: 'user',
      as: 'payments'
    })

    sequelize.models.User.hasMany(sequelize.models.Donation, {
      foreignKey: 'user',
      as: 'donations'
    })

    await sequelize.sync()
  },
  sequelize
}
