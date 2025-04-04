// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation');

/* ---------------------- GET ROUTES ---------------------- */

// Get inventory management view
router.get("/management", utilities.checkLogin, utilities.checkAccountType, invController.buildManagementView);

// Get inventory by classification ID
router.get("/type/:classificationId", invController.buildByClassificationId);

// Get detailed view of an inventory item
router.get("/detail/:inventoryId", invController.getInventoryItem);

// Get Inventory JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Edit info of inventory item
router.get("/edit/:inventoryId", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editItemInformation));

// Get add-classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, invController.buildManagementClassification);

// Get add-inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, invController.addSelectionList);

// Get route to delete inventory item
router.get("/delete/:inventoryId", utilities.checkLogin, utilities.checkAccountType, invController.buildDeletingView);

/* ---------------------- POST ROUTES ---------------------- */

// Process to add classification
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// Process to add inventory
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Process to update info of an inventory item
router.post("/update/",
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Process to delete inventory item
router.post("/delete-confirm",
    utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;