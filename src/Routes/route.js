const express = require("express");
const router = express.Router();

const movies = require("../Controller/movies");
const user = require("../Controller/user");
const auth = require("../Middleware/auth");
const business = require("../Controller/business");
const cart = require("../Controller/cart");
const order = require("../Controller/order");

// router.use("/user/:userId", auth.authentication, auth.authorization);

router.post("/user/:userId/movies", movies.createMovies);
router.get("/movies", movies.getMovies);

router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.get("/user/:userId", user.getUser);
router.put("/user/:userId", user.updateUser);
router.delete("/user/:userId", user.deleteUser);
router.get("/user/:userId/shows", user.getMovies);
router.get("/user/:userId/seats", user.getAvailableSeats);

router.post("/user/:userId/business", business.createBusiness);
router.get("/user/:userId/business/:businessId", business.getBusiness);
router.put("/user/:userId/business/:businessId", business.updateBusiness);
router.put("/user/:userId/business/:businessId/shows", business.updateShows);
router.delete("/user/:userId/business/:businessId", business.deleteBusiness);

router.post("/user/:userId/cart", cart.createCart);
router.get("/user/:userId/cart", cart.getCart);
router.delete("/user/:userId/cart", cart.deleteCart);

router.post("/user/:userId/order", order.createOrder);
router.get("/user/:userId/order", order.getOrder);
router.delete("/user/:userId/order", order.cancelOrder);

router.all("/*", (req, res) => res.status(400).send("Invalid Path"));

module.exports = router;
