module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("user", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		blocked: {
			type: DataTypes.BOOLEAN,
		},
		token: {
			type: DataTypes.TEXT,
		},
		blockedSince: {
			type: DataTypes.DATE,
		},
	});
	return User;
};
