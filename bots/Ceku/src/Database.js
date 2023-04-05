const { Sequelize } = require('sequelize')

const DatabaseFile = [process.cwd(), 'data', 'Home.sqlite'].join('/')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: DatabaseFile,
})

const { Donation, Expense, Payment, User } = require('./Schemas')

module.exports = {
	init: async function () {
		await sequelize.authenticate()

		sequelize.define('User', User)

		sequelize.define('Expense', Expense, { timestamps: true, initialAutoIncrement: 1 })

		sequelize.define('Payment', Payment, { timestamps: true, initialAutoIncrement: 1 })

		sequelize.define('Donation', Donation, { timestamps: true, initialAutoIncrement: 1 })

		sequelize.models.User.hasMany(sequelize.models.Payment, {
			foreignKey: 'user',
			as: 'payments',
		})

		sequelize.models.User.hasMany(sequelize.models.Donation, {
			foreignKey: 'user',
			as: 'donations',
		})

		await sequelize.sync()
	},
	sequelize,
}
