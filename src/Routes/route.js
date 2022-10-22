const express = require("express");
const router = express.Router();

const user = require("../Controllers/userController");
const auth = require("../MIddleware/authentication");
const product = require("../Controllers/productController");
const cart = require("../Controllers/cartController");
const order = require("../Controllers/orderController");

//USER APIs
router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.get(
	"/user/:userId/profile",
	auth.authentication,
	auth.authorization,
	user.getUser
);
router.put(
	"/user/:userId/profile",
	auth.authentication,
	auth.authorization,
	user.updateUser
);

//PRODUCT APIs
router.post("/products", product.createProduct);
router.get("/products", product.getProduct);
router.get("/products/:productId", product.getProductById);
router.put("/products/:productId", product.updateProduct);
router.delete("/products/:productId", product.deleteProductById);

//CART APIs
router.post(
	"/users/:userId/cart",
	auth.authentication,
	auth.authorization,
	cart.createCart
);
router.put(
	"/users/:userId/cart",
	auth.authentication,
	auth.authorization,
	cart.updateCart
);
router.get(
	"/users/:userId/cart",
	auth.authentication,
	auth.authorization,
	cart.getCart
);
router.delete(
	"/users/:userId/cart",
	auth.authentication,
	auth.authorization,
	cart.deleteCart
);

//ORDER APIs
router.post(
	"/users/:userId/orders",
	auth.authentication,
	auth.authorization,
	order.createOrder
);
router.put(
	"/users/:userId/orders",
	auth.authentication,
	auth.authorization,
	order.updateOrder
);

router.all("/*", (req, res) =>
	res.send("Invalid URL. Try the ones from the README.md")
);

module.exports = router;
