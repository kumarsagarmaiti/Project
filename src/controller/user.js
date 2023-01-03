const db = require("../model");

const User = db.users;
const Attempt = db.attempts;

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

		const isEmailPresent = await User.findOne({ where: { email } });
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

		const isEmailPresent = await User.findOne({ where: { email } });
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
		const id = req.userDetails.id;
		const attempts = await Attempt.findAll({ where: { id } });
		let temp = attempts;
		let obj = { user_id: id };

		if (attempts.length == 5) {
			User.update(
				{ blocked: true, blockedSince: new Date() },
				{
					where: { id },
				}
			).catch((e) => console.log(e));
			return res
				.status(401)
				.send(
					"Incorrect password entered five times. Try again after 24 hours."
				);
		} else if (attempts.length < 5) {
			obj.attempt = new Date();
			attempts.push(obj);
			var j = 0;
			for (let i = attempts.length - 1; i >= 1; i--) {
				const elapsedTime =
					(attempts[i].attempt.getTime() - attempts[i - 1].attempt.getTime()) /
					1000;
				if (elapsedTime > 60) {
					temp = attempts.slice(i);
					j = i;
					break;
				}
			}
		}
		while (j >= 0) {
			Attempt.destroy({ where: { id: attempts[j].id } });
			j--;
		}
		for (let attempt of temp)
			await Attempt.create(attempt).catch((e) => console.log(e));

		req.temp = temp;
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const login = async function (req, res) {
	try {
		const { password } = req.body;
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
					}`
				);
		} else {
			const token = jwt.sign({ userId: req.userDetails._id }, "cointab", {
				expiresIn: "1h",
			});
			User.update({ token }, { where: { id: req.userDetails.id } }).catch((e) =>
				console.log(e)
			);
			Attempt.destroy({ where: { user_id: req.userDetails.id } }).catch((e) =>
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
