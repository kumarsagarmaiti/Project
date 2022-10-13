const express = require("express");
const router = express.Router();

const user = require("../Controllers/userController");
const product=require("../Controllers/productController")

router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.put("/user/:userId/profile", user.updateUser);

router.post("/products",product.createProduct)
router.put("/products/:productId",product.updateProduct)
// router.post("/test", (req, res) => {
// 	console.log(req.headers.authorization.replace("Bearer","").trim());
// 	return res.send("success");
// });

module.exports = router;
