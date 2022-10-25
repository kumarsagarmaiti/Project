const express = require("express");
const router = express.Router();

const movies = require("../Controller/movies");
const user = require("../Controller/user");
const auth = require("../Middleware/auth");
const business = require("../Controller/business");

// router.use("/user/:userId", auth.authentication, auth.authorization);

router.post("/movies", movies.createMovies);
router.get("/movies", movies.getMovies);

router.post("/register", user.createUser);
router.post("/login", user.userLogin);
router.get("/user/:userId", user.getUser);
router.put("/user/:userId", user.updateUser);
router.delete("/user/:userId", user.deleteUser);
router.get("/user/:userId/movies", user.getMovies);

router.post("/user/:userId/business", business.createBusiness);
router.get("/user/:userId/business/:businessId", business.getBusiness);
router.put("/user/:userId/business/:businessId", business.updateBusiness);
router.put("/user/:userId/business/:businessId/shows", business.updateShows);
router.delete("/user/:userId/business/:businessId", business.deleteBusiness);

router.all("/*", (req, res) => res.status(400).send("Invalid Path"));

module.exports = router;
