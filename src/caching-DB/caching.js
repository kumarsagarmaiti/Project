const redis = require("redis");
const { promisify } = require("util");

// const redisclient = redis.createClient(
//     11082,
//     'redis-11082.c212.ap-south-1-1.ec2.cloud.redislabs.com:11082',
//     {no_ready_check:true}
//     )

const redisclient = redis.createClient({
	host: "redis-11082.c212.ap-south-1-1.ec2.cloud.redislabs.com",
	port: 11082,
	password: "XsBPYr9y3y2qOTMnUUzjZbS8QEj5T0TK",
});
redisclient.on("error", (err) => {
	console.log("Error " + err);
});

redisclient.on("connect", async function () {
	console.log("redis is connected");
});

const SET_ASYNC = promisify(redisclient.SET).bind(redisclient);
const GET_ASYNC = promisify(redisclient.GET).bind(redisclient);

module.exports = { SET_ASYNC, GET_ASYNC };
