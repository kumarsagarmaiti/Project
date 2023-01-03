const dbConfig = require("../config");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	pool: {
		min: dbConfig.pool.min,
		max: dbConfig.pool.max,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

sequelize
	.authenticate()
	.then(() => console.log("successfully authenticated"))
	.catch((e) => console.log(e));

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./user")(sequelize, DataTypes);
db.attempts = require("./attempts")(sequelize, DataTypes);

db.sequelize
	.sync({ force: false })
	.then(() => console.log("re-sync success"))
	.catch((e) => console.log(e));

db.users.hasMany(db.attempts, {
	foreignKey: "user_id",
	as: "attempt",
});

db.attempts.belongsTo(db.users, {
	foreignKey: "user_id",
	as: "user",
});

module.exports = db;
