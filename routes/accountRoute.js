// Needed resources
const express = require("express");
const router = new express.Router() ;
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

/* *****************
 * Deliver Login View
 * ***************** */

// Route to "Login"
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process Login
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Route to "Registration"
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process Registration
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Route to Account Management
router.get("/account-management", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to Update Account Info
router.get("/update-account/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

// Process Update Account Info
router.post("/update-account", utilities.handleErrors(accountController.updateAccount))

module.exports = router;