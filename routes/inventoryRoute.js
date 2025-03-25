// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build the inventory item detail view
router.get("/detail/:inventoryId", invController.getInventoryItem);

// Route to management view
router.get("/", invController.buildManagementView);

module.exports = router;