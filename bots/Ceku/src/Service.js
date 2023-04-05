const { sequelize } = require('./Database')

// Create User
module.exports.register = async (sender, name, isRoommate) => {
	const user = await sequelize.models.User.create({
		id: sender.id,
		name,
		isRoommate,
	})
	return user
}

// Confirm User
module.exports.confirm = async sender => {
	// set confirmed to true
	await sequelize.models.User.update({ confirmed: true }, { where: { id: sender.id } })
}

// Check if user is confirmed
module.exports.isConfirmed = async sender => {
	const user = await sequelize.models.User.findOne({
		where: { id: sender.id },
		raw: true,
	})
	return user?.confirmed || false
}

// Remove User
module.exports.removeUser = async sender => {
	await sequelize.models.User.update({ active: false }, { where: { id: sender.id } })
}

// get single user
module.exports.user = async id => {
	const user = await sequelize.models.User.findOne({ where: { id }, raw: true })
	return user || null
}

// Add Expense
module.exports.expense = async (amount, label, desc, sender) => {
	// check if user is roommate
	const user = await sequelize.models.User.findOne({
		where: { id: sender.id },
		raw: true,
	})

	if (!user.isRoommate) {
		throw new Error('Evin adamı değilsin, Ne gideri ekliyon')
	}

	await sequelize.models.Expense.create({
		amount,
		label,
		desc,
		addedBy: sender.id,
	})
}

// Add Payment
module.exports.pay = async (senderId, amount, desc) => {
	await sequelize.models.Payment.create({ user: senderId, amount, desc })
}

// Add Donation
module.exports.donate = async (sender, amount, desc) => {
	const donation = await sequelize.models.Donation.create({
		user: sender.id,
		amount,
		desc,
	})
	return donation
}

// Get Users
module.exports.users = async () => {
	const users = await sequelize.models.User.findAll({
		raw: true,
	})
	return users
}

// Get Payments of user
module.exports.payments = async (limit, sender) => {
	// get latest payments of sender
	if (sender) {
		const payments = await sequelize.models.Payment.findAll({
			where: { user: sender.id },
			limit,
			order: [['createdAt', 'DESC']],
			raw: true,
		})
		return payments
	}

	// get latest payments
	else {
		const payments = await sequelize.models.Payment.findAll({
			limit,
			order: [['createdAt', 'DESC']],
			raw: true,
		})

		const fixed = await Promise.all(
			payments.map(async l => {
				const user = await sequelize.models.User.findOne({
					where: { id: l.user },
					raw: true,
				})
				return { ...l, user: user.name }
			})
		)

		return fixed
	}
}

// Get Donations of user
module.exports.donations = async (sender, limit) => {
	// get latest payments limited by limit
	const donations = await sequelize.models.Donation.findAll({
		where: { user: sender.id },
		limit,
		order: [['createdAt', 'DESC']],
		raw: true,
	})

	// get total donation amount of user
	const total = await sequelize.models.Donation.sum('amount', {
		where: { user: sender.id },
	})

	return { latest: donations, total }
}

// Get expenses
module.exports.expenses = async limit => {
	// get latest expenses limited by limit
	const expenses = await sequelize.models.Expense.findAll({
		limit,
		order: [['createdAt', 'DESC']],
		raw: true,
	})

	const fixed = await Promise.all(
		expenses.map(async l => {
			const user = await sequelize.models.User.findOne({
				where: { id: l.addedBy },
				raw: true,
			})
			return { ...l, addedBy: user.name }
		})
	)

	return fixed
}

// Get Donation Leaderboard
module.exports.donationLeaderBoard = async () => {
	// get 3 users with maximum donations in total and their total donation amount
	const leaders = await sequelize.models.Donation.findAll({
		attributes: ['user', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
		group: ['user'],
		order: [[sequelize.fn('sum', sequelize.col('amount')), 'DESC']],
		limit: 3,
		raw: true,
	})

	const map = await Promise.all(
		leaders.map(async l => {
			const user = await sequelize.models.User.findOne({
				where: { id: l.user },
				raw: true,
			})
			return { user: user.name, total: l.total }
		})
	)

	return map
}

// Get Debt of User
module.exports.debt = async sender => {
	// check if user is roommate
	const user = await sequelize.models.User.findOne({
		where: { id: sender.id },
		raw: true,
	})
	if (!user.isRoommate) return 0

	const roommateCount = await sequelize.models.User.count({
		where: { isRoommate: true, active: true },
	})

	const totalExpenses = await sequelize.models.Expense.sum('amount')
	const totalDonations = await sequelize.models.Donation.sum('amount')

	const netExpense = totalExpenses - totalDonations

	const expenseShare = netExpense / roommateCount

	const myTotalPayments = await sequelize.models.Payment.sum('amount', {
		where: { user: sender.id },
	})

	return expenseShare - myTotalPayments
}
