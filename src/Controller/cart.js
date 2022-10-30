const Cart = require("../Models/cartmodel");
const Business = require("../Models/businessmodel");
const validate = require("../Utils/validator");
const moment = require("moment");

const createCart = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide cart data" });

		const { date, time, movieId, businessId, seats } = req.body;

		const mandatoryFields = ["date", "time", "movieId", "businessId", "seats"];
		for (field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		if (
			!moment(req.body.date, "DD/MM/YYYY", true).isValid() ||
			!validate.isValid(req.body.date)
		)
			return res.status(400).send({
				status: false,
				message: `Invalid date format. Try DD/MM/YYYY`,
			});
		const relative = moment(date, "DD/MM/YYYY").fromNow();
		if (relative == "Invalid date") {
			return res.status(400).send({ status: false, message: "Invalid date" });
		} else if (
			!(relative.split(" ")[0] == "in") &&
			relative.split(" ")[1] != "hours"
		)
			return res.status(400).send({ status: false, message: "Older Date" });
		if (
			!moment(req.body.time, "LT", true).isValid() ||
			!validate.isValid(req.body.time)
		)
			return res.status(400).send({
				status: false,
				message: `Invalid time format. Try 00:00 PM/AM`,
			});
		const relativeTime = moment(time, "h:mm:ss a").fromNow();
		if (!relativeTime.split(" ")[0] == "in")
			return res.status(400).send({ status: false, message: "Older time" });

		if (!validate.isValidObjectId(movieId))
			return res.status(400).send({
				status: false,
				message: `Invalid movieId: ${movieId}`,
			});

		if (!Array.isArray(seats) || seats.length < 1)
			return res
				.status(400)
				.send({ status: false, message: "Please provide seats" });

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}`,
			});
		const findBusiness = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		}).lean();
		if (!findBusiness)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});
		if (findBusiness.userId.toString() !== req.params.userId)
			return res.status(403).send({
				status: false,
				message: "UserId doesnt match with the business's userId",
			});

		let flag = false;
		let totalPrice = 0;
		if (findBusiness.shows[date]) {
			for (show of findBusiness.shows[date]) {
				if (show.movieId.toString() == movieId && show.timings == time) {
					flag = true;
					for (let seat of seats) {
						if (
							!show.availableSeats[seat] ||
							show.availableSeats[seat] != "Available"
						) {
							return res
								.status(400)
								.send({ status: false, message: `${seat} is not available` });
						} else {
							totalPrice += show.ticketPrice[seat.charAt(0)];
						}
					}
				} else {
					flag = false;
				}
			}
		}
		if (!flag) {
			return res
				.status(404)
				.send({ status: false, message: "No seats found for given details" });
		}
		req.body.totalPrice = totalPrice;
		const ifSeatsBooked = await Cart.findOne({ seats: { $in: seats } });
		if (ifSeatsBooked)
			return res.status(400).send({
				status: false,
				message: `${ifSeatsBooked.seats} booking is under process. Select other seats or try again after 5 mins.`,
			});
		req.body.userId = req.params.userId;
		const createCart = await Cart.create(req.body);
		res.status(201).send({
			status: true,
			message: "Seats added to cart. Proceed to checkout within 5 mins.",
			data: createCart,
		});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getCart = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide cart data" });

		if (!validate.isValidObjectId(req.body.cartId))
			return res.status(400).send({
				status: false,
				message: `Invalid movieId: ${req.body.cartId}`,
			});

		const findCart = await Cart.findById(req.body.cartId);
		if (!findCart)
			return res.status(404).send({ status: true, message: "Cart not found" });
		if (findCart.userId.toString() != req.params.userId)
			return res.status(403).send({
				status: false,
				message: "Cart's userId doesn't match with the userId in params",
			});
		else return res.status(200).send({ status: true, data: findCart });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const deleteCart = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide cart data" });

		if (!validate.isValidObjectId(req.body.cartId))
			return res.status(400).send({
				status: false,
				message: `Invalid movieId: ${req.body.cartId}`,
			});

		const deleteCart = await Cart.findOneAndRemove({
			_id: req.body.cartId,
			userId: req.params.userId,
		});
		if (!deleteCart)
			return res.status(404).send({ status: false, message: "Cart not found" });
		else return res.status(204).send();
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createCart, getCart, deleteCart };
