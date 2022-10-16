const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const validate = require("../Utility/validator");
// const ObjectID = require("mongoose").Types.ObjectId;
const reg = new RegExp("^[0-9]+$");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const createCart = async function (req, res) {
	try {
		const userIdFromBody = req.body.userId;
		let cartData = req.body;
		if (!validate.isValidInputBody(cartData))
			return res
				.status(400)
				.send({ status: false, message: "Please provide cart details" });

		if (!cartData["items"])
			return res
				.status(400)
				.send({ status: false, message: `Please provide ${field}` });
		if (!validate.isValid(cartData["items"]))
			return res
				.status(400)
				.send({ status: false, message: `Please provide a valid ${field}` });

		if (
			validate.isValidJSONstr(cartData.items) ||
			typeof JSON.parse(cartData.items) !== "object" ||
			JSON.parse(cartData.items).length < 1
		)
			return res.status(400).send({
				status: false,
				message:
					"Please provide items in an object in an array and a valid JSON string",
			});

		cartData.items = JSON.parse(cartData.items);

		const unavailableProducts = [];
		const availableProducts = [];
		let cartPresent = await Cart.findOne({ userId: userIdFromBody }).lean();
		if (cartPresent && cartPresent.items.length > 0) {
			for (item of cartData.items) {
				if (!item.productId)
					return res
						.status(400)
						.send({ status: false, message: "Please provide productId" });
				if (!item.quantity)
					return res.status(400).send({
						status: false,
						message: `Please provide quantity for productId: ${item.productId}`,
					});
				if (!validate.isValidObjectId(item.productId))
					return res.status(400).send({
						status: false,
						message: "Please provide a valid productId",
					});
				if (!reg.test(item.quantity) || Number(item.quantity) < 1)
					return res.status(400).send({
						status: false,
						message:
							"Please provide a valid quantity number more than or equal to one",
					});
				const productPresent = await Product.findOne({
					_id: item.productId,
					isDeleted: false,
				});
				if (!productPresent) {
					unavailableProducts.push(item.productId);
					continue;
				}
				const itemPresent = await Cart.findOne({
					items: { $elemMatch: { productId: item.productId } },
				}).lean();
				if (itemPresent) {
					for (item1 of itemPresent.items) {
						if (item1.productId.toString() == item.productId) {
							item1.quantity += Number(item.quantity);
							availableProducts.push(item1);
						}
					}
					cartPresent.totalItems += Number(item.quantity);
					cartPresent.totalPrice +=
						productPresent.price * Number(item.quantity);
				} else {
					cartPresent.items.push(item);
					cartPresent.totalItems += Number(item.quantity);
					cartPresent.totalPrice +=
						productPresent.price * Number(item.quantity);
				}
			}

			for (i = 0; i < cartPresent.items.length; i++) {
				for (j = 0; j < availableProducts.length; j++) {
					if (
						cartPresent.items[i].productId.toString() ==
						availableProducts[j].productId
					) {
						cartPresent.items[i] = availableProducts[j];
					}
				}
			}
			cartPresent.items = [...cartPresent.items];
			const updateCart = await Cart.findByIdAndUpdate(
				cartPresent["_id"],
				cartPresent,
				{ new: true }
			);
			return res.status(201).send({
				status: true,
				message: `Products with productId: ${unavailableProducts.join(
					", "
				)} unavailable or out of stock`,
				data: updateCart,
			});
		}

		cartData.totalPrice = 0;
		cartData.totalItems = 0;

		let findingDuplicates = {};
		for (item of cartData.items) {
			if (findingDuplicates[item.productId])
				findingDuplicates[item.productId] += Number(item.quantity);
			else findingDuplicates[item.productId] = Number(item.quantity);
		}
		const tempArr = [];
		for (key in findingDuplicates) {
			tempArr.push({ productId: key, quantity: findingDuplicates[key] });
		}
		cartData.items = [...tempArr];
		for (item of cartData.items) {
			if (!item.productId)
				return res
					.status(400)
					.send({ status: false, message: "Please provide productId" });
			if (!item.quantity)
				return res
					.status(400)
					.send({ status: false, message: "Please provide quantity" });
			if (!validate.isValidObjectId(item.productId))
				return res
					.status(400)
					.send({ status: false, message: "Please provide a valid productId" });
			if (!reg.test(item.quantity) || Number(item.quantity) < 1)
				return res.status(400).send({
					status: false,
					message:
						"Please provide a valid quantity number more than or equal to one",
				});

			let quantity = Number(item.quantity);
			const isProductAvailable = await Product.findOne({
				_id: item.productId,
				isDeleted: false,
			});
			if (isProductAvailable) {
				cartData.totalPrice += isProductAvailable.price * quantity;
				cartData.totalItems += quantity;
				availableProducts.push(item);
			} else {
				unavailableProducts.push(item.productId);
			}
		}
		cartData.items = [...availableProducts];
		if (cartPresent) {
			if (cartPresent.items.length == 0) {
				const updateCart = await Cart.findOneAndUpdate(
					{ userId: userIdFromBody },
					cartData,
					{ new: true }
				);
				return res.status(200).send({
					status: true,
					message: `Products with productId: ${unavailableProducts.join(
						", "
					)} unavailable or out of stock`,
					data: updateCart,
				});
			}
		}
		const createCart = await Cart.create(cartData);
		res.status(201).send({
			status: true,
			message: `Products with productId: ${unavailableProducts.join(
				", "
			)} unavailable or out of stock`,
			data: createCart,
		});
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

const updateCart = async function (req, res) {
	try {
		let { cartId, productId, removeProduct } = req.body;
		if (!validate.isValidInputBody(req.body))
			return res.status(400).send({
				status: false,
				message: "Please provide cart updation details",
			});

		const mandatoryFields = ["cartId", "productId", "removeProduct"];
		for (field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
			if (!validate.isValid(req.body[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		if (!reg.test(Number(removeProduct))) {
			return res
				.status(400)
				.send({ status: false, message: "Not a valid removeProduct" });
		}
		removeProduct = Number(removeProduct);
		mandatoryFields.pop();
		for (field of mandatoryFields) {
			if (!validate.isValidObjectId(req.body[field]))
				return res
					.status(400)
					.send({ status: false, message: `Invalid ObjectId:${field}` });
		}

		const cartExists = await Cart.findById(cartId);
		if (cartExists) {
			const productExistsInCart = await Cart.findOne({
				items: { $elemMatch: { productId } },
			}).lean();
			if (!productExistsInCart)
				return res.status(400).send({
					status: false,
					message: `Product with productId ${productId} doesn't exist in the cart`,
				});

			let productQuantity = productExistsInCart.items.find((item) => {
				if (item.productId.toString() == productId) return item.quantity;
			});

			const productExists = await Product.findById(productId).lean();
			if (
				removeProduct == 0 ||
				productQuantity.quantity - removeProduct < 1 ||
				productExists.isDeleted == true
			) {
				const updateCart = await Cart.findByIdAndUpdate(
					cartId,
					{
						$pull: { items: { productId } },
						$inc: {
							totalItems: -productQuantity.quantity,
							totalPrice: -(productQuantity.quantity * productExists.price),
						},
					},
					{ new: true }
				);
				return res
					.status(200)
					.send({ status: true, message: "Success", data: updateCart });
			} else {
				const updateCart = await Cart.findOneAndUpdate(
					{ "items.productId": { _id: productId } },
					{
						$inc: {
							totalItems: -removeProduct,
							totalPrice: -(removeProduct * productExists.price),
							"items.$.quantity": -removeProduct,
						},
					},
					{ arrayFilters: [{ "element.productId": productId }], new: true }
				);
				return res
					.status(200)
					.send({ status: true, message: "Success", data: updateCart });
			}
		} else {
			return res.status(400).send({
				status: false,
				message: `Cart with the cartId: ${cartId} doesn't exist`,
			});
		}
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

const getCart = async function (req, res) {
	try {
		const userId = req.params.userId;
		const findCart = await Cart.findOne({ userId });
		if (!findCart)
			return res.status(404).send({
				status: false,
				message: `Cart with userId: ${userId} not found`,
			});
		return res
			.status(200)
			.send({ status: true, message: "Success", data: findCart });
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

const deleteCart = async function (req, res) {
	try {
		const userId = req.params.userId;
		const findCart = await Cart.findOne({ userId }).lean();
		if (!findCart)
			return res.status(404).send({
				status: false,
				message: `Cart with userId: ${userId} not found`,
			});

		if (findCart.items.length == 0)
			return res
				.status(200)
				.send({ status: true, message: "Cart deleted successfully" });
		findCart.items = [];
		findCart.totalItems = 0;
		findCart.totalPrice = 0;
		const deleteCart = await Cart.findOneAndUpdate({ userId }, findCart);
		return res
			.status(200)
			.send({ status: true, message: "Cart deleted successfully" });
	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createCart, updateCart, getCart, deleteCart };
