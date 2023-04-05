const { DataTypes } = require('sequelize')

module.exports = {
	User: {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		isRoommate: {
			type: DataTypes.BOOLEAN,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		confirmed: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	Expense: {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		amount: {
			type: DataTypes.FLOAT,
		},
		label: {
			type: DataTypes.STRING,
		},
		desc: {
			type: DataTypes.STRING,
		},
		addedBy: {
			type: DataTypes.INTEGER,
		},
	},
	Payment: {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user: {
			type: DataTypes.INTEGER,
		},
		amount: {
			type: DataTypes.FLOAT,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
	Donation: {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user: {
			type: DataTypes.INTEGER,
		},
		amount: {
			type: DataTypes.FLOAT,
		},
		desc: {
			type: DataTypes.STRING,
		},
	},
}
