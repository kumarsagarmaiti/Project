module.exports = (sequelize, DataTypes) => {
	const Attempt = sequelize.define("attempt", {
		attempt: {
			type: DataTypes.DATE,
		},
	});
	return Attempt;
};
