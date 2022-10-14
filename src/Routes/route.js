const express = require("express");
const router = express.Router();

const user = require("../Controllers/userController");
const auth = require("../MIddleware/authentication");
const product = require("../Controllers/productController");

router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.put(
	"/user/:userId/profile",
	auth.authentication,
	auth.authorization,
	user.updateUser
);

router.post("/products", product.createProduct);
router.get("/products", product.getProduct);
router.put("/products/:productId", product.updateProduct);
router.get("/products/:productId", product.getProductById);
router.delete("/products/:productId",product.deleteProductById)

router.all("/*",(req,res)=>res.send("Invalid URL. Try the ones from the project"))

module.exports = router;
