const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

const register = async function (req, res) {
	try {
		if (!Object.keys(req.body))
			return res.status(400).send("Please provide email and password");
		let { email, password } = req.body;
		if (!email || !emailRegex.test(email))
			return res.status(400).send("Please provide a valid emailId");
		if (!password || !passwordRegex.test(password))
			return res.status(400).send("Please provide a valid password");

		const isEmailPresent = await User.findOne({ email });
		if (isEmailPresent) return res.status(400).send("Email already in use");

		req.body.password = await bcrypt.hash(password, 10);
		const createUser = await User.create(req.body);
		return res
			.status(201)
			.send({ msg: "User created successfully", data: createUser });
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const checkBlock = async function (req, res, next) {
	try {
		if (!Object.keys(req.body))
			return res.status(400).send("Please provide email and password");
		let { email, password } = req.body;
		if (!email || !emailRegex.test(email))
			return res.status(400).send("Please provide a valid emailId");
		if (!password) return res.status(400).send("Please provide password");

		const isEmailPresent = await User.findOne({ email }).lean();
		if (!isEmailPresent)
			return res.status(404).send("No user found with the emailId");

		if (isEmailPresent.blocked) {
			const logTime = new Date();
			const remainderTime = Math.ceil(
				(logTime.getTime() - isEmailPresent.blockedSince.getTime()) / 3600000
			);
			if (remainderTime < 24)
				return res
					.status(401)
					.send(
						`Account locked due to too many incorrect attempts. Please try again after ${
							24 - remainderTime
						} hours`
					);
			else
				User.findOneAndUpdate(
					{ email },
					{ blocked: false, blockedSince: null }
				).catch((e) => console.log(e));
		}
		req.userDetails = isEmailPresent;
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const checkAttempts = async function (req, res, next) {
	try {
		const { email } = req.body;
		const userDetails = req.userDetails;
		let temp = null;
		let arr = userDetails.attempts;

		if (userDetails.attempts.length == 5) {
			User.findOneAndUpdate(
				{ email },
				{ attempts: [], blocked: true, blockedSince: new Date() }
			).catch((e) => console.log(e));
			return res
				.status(401)
				.send(
					"Incorrect password entered five times. Try again after 24 hours."
				);
		} else if (userDetails.attempts.length < 5) {
			arr.push(new Date());
			for (let i = arr.length - 1; i >= 1; i--) {
				const elapsedTime = (arr[i].getTime() - arr[i - 1].getTime()) / 1000;
				if (elapsedTime > 60) {
					arr = arr.slice(i);
					break;
				}
			}
		}
		temp = arr;
		User.findOneAndUpdate({ email }, { attempts: temp }).catch((e) =>
			console.log(e)
		);
		req.temp = temp;
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const login = async function (req, res) {
	try {
		const { email, password } = req.body;
		const isPasswordCorrect = await bcrypt.compare(
			password,
			req.userDetails.password
		);
		if (!isPasswordCorrect) {
			return res
				.status(401)
				.send(
					`Incorrect password. Account will be locked for 24 hours after ${
						6 - req.temp.length
					} attempts.`
				);
		} else {
			const token = jwt.sign({ userId: req.userDetails._id }, "cointab", {
				expiresIn: "1h",
			});
			User.findOneAndUpdate({ email }, { attempts: [], token }).catch((e) =>
				console.log(e)
			);
			return res.status(200).send({ token });
		}
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const logout = async function (req, res) {
	try {
		let token = req.headers.authorization.split(" ")[1];
		User.findOneAndUpdate({ token }, { token: "token" }).catch((e) =>
			console.log(e)
		);
		return res.status(200).send("Logged Out successfully");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { register, checkBlock, checkAttempts, login, logout };
