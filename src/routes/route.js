const express = require("express");
const router = express.Router();

const { createAdmin, loginAdmin } = require("../controller/admin");
const {
	createOrganization,
	getOrganization,
} = require("../controller/organization");
const {
	createProperties,
	deleteProperty,
	getProperty,
} = require("../controller/properties");
const {
	createRegions,
	deleteRegion,
	getRegion,
} = require("../controller/regions");
const { createCropCycle, getCropCycle } = require("../controller/crops");
const { createOwner, loginOwner } = require("../controller/owner");
const { createFields, deleteField, getField } = require("../controller/fields");

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
router.get("/admin/:admin/organization", getOrganization);

router.post("/admin/:admin/properties", createProperties);
router.get("/admin/:admin/properties", getProperty);
router.delete("/admin/:admin/properties", deleteProperty);

router.post("/admin/:admin/regions", createRegions);
router.get("/admin/:admin/regions", getRegion);
router.delete("/admin/:admin/regions", deleteRegion);

router.post("/admin/:admin/cropCycle", createCropCycle);
router.get("/admin/:admin/cropCycle", getCropCycle);

router.post("/register/owner", createOwner);
router.post("/login/owner", loginOwner);

router.post("/owner/:owner/fields", createFields);
router.get("/owner/:owner/fields", getField);
router.delete("/owner/:owner/fields", deleteField);

module.exports = router;
