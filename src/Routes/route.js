const express = require("express");
const router = express.Router();

const movies = require("../Controller/movies");
const user = require("../Controller/user");
const auth = require("../Middleware/auth");
const business = require("../Controller/business");

// router.use("/user/:userId", auth.authentication, auth.authorization);

router.post("/movies", movies.createMovies);

router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.get("/user/:userId", user.getUser);
router.put("/user/:userId", user.updateUser);
router.delete("/user/:userId", user.deleteUser);

router.post("/user/:userId/business", business.createBusiness);
router.get("/user/:businessId/business", business.getBusiness);
router.put("/user/:businessId/business", business.updateBusiness);

router.all("/*", (req, res) => res.status(400).send("Invalid Path"));

module.exports = router;
