// Needed resources
const express = require("express");
const router = new express.Router() ;
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

/* *****************
 * Deliver Login View
 * ***************** */

// Route to "My Account"
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to "Registration"
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;