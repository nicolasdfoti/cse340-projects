// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory item detail view
router.get("/detail/:inventoryId", invController.getInventoryItem);

// Route to build the table in the management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to modify/edit inventory items
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editItemInformation)) 


// Route to management view
router.get("/management", invController.buildManagementView);

// Route to Add Classification
router.get("/add-classification", invController.buildManagementClassification);

// Route to Add Inventory
router.get("/add-inventory", invController.addSelectionList);

// Processes!

// Process Classification
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassData, utilities.handleErrors(invController.addClassification));

// Process Inventory
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory));

// Process Update Inventory
router.post("/update/", invValidate.newInventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

module.exports = router;