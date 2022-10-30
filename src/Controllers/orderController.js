const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const validate = require("../Utility/validator");

const createOrder = async function (req, res) {
	try {
		const userId = req.params.userId;
		const { cartId, status } = req.body;

		if (!req.userDetails.address.shipping.street)
			return res.status(400).send({
				status: false,
				message: "Please provide address to proceed with the order",
			});

		if (!cartId)
			return res
				.status(400)
				.send({ status: false, message: "Please provide cartId" });
		if (!validate.isValidObjectId(cartId))
			return res.status(400).send({ status: false, message: "Invalid cartId" });
		const findCart = await Cart.findOne({ userId }).lean();
		if (!findCart)
			return res.status(404).send({
				status: false,
				message: `Cart not found with the userId: ${userId}`,
			});
		if (cartId !== findCart["_id"].toString())
			return res.status(400).send({
				status: false,
				message: "cartId doesn't match with the one present for the user",
			});
		if (findCart.items.length < 1)
			return res.status(200).send({
				status: false,
				message: "Empty cart. Add items in cart to proceed.",
			});

		if (status && status !== "pending")
			return res.status(400).send({
				status: false,
				message: `status can only be pending`,
			});

		const unavailableItems = []; //add availableItems array
		for (item of findCart.items) {
			const findProduct = await Product.findOne({
				_id: item.productId,
				isDeleted: false,
			}).lean();
			if (!findProduct) unavailableItems.push(item.productId);
		}

		if (unavailableItems.length > 0)
			return res.status(200).send({
				status: false,
				message: `Items in your cart with the productId: ${unavailableItems.join(
					", "
				)} went out of stock. Please remove the product to proceed.`,
			});

		const cartDetails = {
			items: findCart.items,
			totalPrice: findCart.totalPrice,
			totalItems: findCart.totalItems,
			totalQuantity: 0,
			userId,
		};

		for (item of findCart.items) {
			cartDetails.totalQuantity += item.quantity;
		}

		findCart.items = [];
		findCart.totalItems = 0;
		findCart.totalPrice = 0;
		const deleteCart = await Cart.findByIdAndUpdate(cartId, findCart);

		const createOrder = await Order.create(cartDetails);
		return res.status(201).send({
			status: true,
			message: "Ordered created successfully",
			data: createOrder,
		});
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

const updateOrder = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide updation details" });

		const { orderId, status } = req.body;
		const userId = req.params.userId;
		if (
			!orderId ||
			!validate.isValid(orderId) ||
			!validate.isValidObjectId(orderId)
		)
			return res
				.status(400)
				.send({ status: false, message: "Please provide a valid orderId" });

		if (!status || !validate.isValid(status))
			return res
				.status(400)
				.send({ status: false, message: "Please provide status" });
		if (status !== "completed" && status !== "cancelled")
			return res.status(400).send({
				status: false,
				message: `status will can only have one of these values: completed of cancelled`,
			});

		const isOrderPresent = await Order.findOne({
			_id: orderId,
			userId,
			isDeleted: false,
		});
		if (!isOrderPresent)
			return res.status(404).send({
				status: false,
				message: "Order with the given orderId not found",
			});

		if (isOrderPresent.status === "cancelled")
			return res
				.status(400)
				.send({ status: false, message: "Order has already been cancelled" });
		if (isOrderPresent.status === "completed")
			return res
				.status(400)
				.send({ status: false, message: "Order has already been completed" });

		if (status == "cancelled" && !isOrderPresent.cancellable)
			return res
				.status(400)
				.send({ status: false, message: "The order is not cancellable" });

		const updateOrder = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true }
		);
		return res.status(200).send({
			status: true,
			message: "Order status updated successfully",
			data: updateOrder,
		});
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createOrder, updateOrder };
