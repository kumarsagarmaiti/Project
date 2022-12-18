const express = require("express");
const router = express.Router();

const { createAdmin, loginAdmin } = require("../controller/admin");
const { createOrganization } = require("../controller/organization");
const { createProperties } = require("../controller/properties");
const { createRegions } = require("../controller/regions");
const { createCropCycle } = require("../controller/crops");
const { createOwner, loginOwner } = require("../controller/owner");
const { createFields } = require("../controller/fields");

const {
	authenticationAdmin,
	authorizationAdmin,
} = require("../middleware/authAdmin");
const {
	authenticationOwner,
	authorizationOwner,
} = require("../middleware/authOwner");

router.use("/admin/:admin", authenticationAdmin, authorizationAdmin);
router.use("/owner/:owner", authenticationOwner, authorizationOwner);

router.post("/register/admin", createAdmin);
router.post("/login/admin", loginAdmin);

router.post("/admin/:admin/organization", createOrganization);

router.post("/admin/:admin/properties", createProperties);

router.post("/admin/:admin/regions", createRegions);

router.post("/admin/:admin/cropCycle", createCropCycle);

router.post("/register/owner", createOwner);
router.post("/login/owner", loginOwner);

router.post("/owner/:owner/fields", createFields);

module.exports = router;
