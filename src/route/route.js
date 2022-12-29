const router = require("express").Router();

const {
	register,
	checkBlock,
	checkAttempts,
	login,
	logout,
} = require("../controller/user");

const { authentication } = require("../auth/auth.js");

router.post("/register", register);
router.post("/login", checkBlock, checkAttempts, login);
router.post("/logout", authentication, logout);

module.exports = router;
