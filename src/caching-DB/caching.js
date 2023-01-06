const redis = require("redis");
const { promisify } = require("util");

// const redisclient = redis.createClient(
//     13585,
//     'redis-13585.c301.ap-south-1-1.ec2.cloud.redislabs.com',
//     {no_ready_check:true}
//     )
//     redisclient.auth("p3gXzqtvssZriZI1dCh3klI0qFjmmoZn", function(err){
//         if(err) throw (err)
//     })

const redisclient = redis.createClient({
	host: "redis-11082.c212.ap-south-1-1.ec2.cloud.redislabs.com",
	port: 11082,
	password: "XsBPYr9y3y2qOTMnUUzjZbS8QEj5T0TK",
});

redisclient.on("connect", async function () {
	console.log("redis is connected");
});

const SET_ASYNC = promisify(redisclient.SET).bind(redisclient);
const GET_ASYNC = promisify(redisclient.GET).bind(redisclient);

module.exports = { SET_ASYNC, GET_ASYNC };
