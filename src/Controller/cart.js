const Cart = require("../Models/cartmodel");
const Business = require("../Models/businessmodel");
const validate = require("../Utils/validator");

const createCart = async function (req, res) {
	try {
		const { date, time, movieId, businessId, seats } = req.body;

		req.body.userId = req.params.userId;
		const findBusiness = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		});
		if (!findBusiness)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});

		let totalPrice = 0;
		if (findBusiness.shows[date]) {
			for (show of findBusiness.shows[date]) {
				if (show.movieId.toString() == movieId && show.timings == time) {
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
				}
			}
		}
		req.body.totalPrice = totalPrice;
		const ifSeatsBooked = await Cart.findOne({ seats: { $in: seats } });
		if (ifSeatsBooked)
			return res.status(400).send({
				status: false,
				message: `${ifSeatsBooked.seats} booking is under process. Select other seats or try again after 5 mins.`,
			});

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
		const findCart = await Cart.findById(req.body.cartId);
		if (!findCart)
			return res.status(404).send({ status: true, message: "Cart not found" });
		else return res.status(200).send({ status: true, data: findCart });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const deleteCart = async function (req, res) {
	try {
		const deleteCart = await Cart.findOneAndRemove({ _id: req.body.cartId });
		if (!deleteCart)
			return res.status(404).send({ status: false, message: "Cart not found" });
		else return res.status(204).send();
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createCart, getCart, deleteCart };
