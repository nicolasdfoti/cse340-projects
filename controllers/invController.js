const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {

  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null
    })
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build inventory by item detail view
 * ************************** */
invCont.getInventoryItem = async function (req, res, next) {

  try {
    const inventory_id = req.params.inventoryId;
    const vehicleData = await invModel.getVehicleById(inventory_id);

    const vehicleDetail = await utilities.buildVehicleDetail(vehicleData);
    let nav = await utilities.getNav();

    res.render("inventory/detailedView", { 
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
      nav,
      vehicleDetail,
      errors: null
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {

  try {

    let nav = await utilities.getNav();

    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/management", {

      title: "Management",
      nav,
      classificationList,
      errors: null
    })

  } catch (err) {
    next(err)
  }

}

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildManagementClassification = async function (req, res, next) {

  try {

    let nav = await utilities.getNav();

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })

  } catch (err) {
    next(err)
  }

}

/* ****************************************
*  Process Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {

    const { classification_name } = req.body
  
    const regResult = await invModel.addClassification(classification_name)
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you added ${classification_name} as Classification`
      )

      let nav = await utilities.getNav()

      res.status(201).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
      })
    } 
    
    else {
      req.flash("notice", "Sorry, the process failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
      })
    }
}

/* ****************************************
*  Process Inventory
* *************************************** */
invCont.addSelectionList = async function (req, res, next) {

  try {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: null
  })
  } catch (err) {
    next(err)
  }

}

/* ***************************
 *  Add new Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next){

  let nav = await utilities.getNav();
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  try {
    const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

    if (addResult.rowCount > 0) { 
      req.flash("notice", `Inventory item "${inv_make} ${inv_model}" added successfully!`);
      return res.redirect("/inv/add-inventory");
    }
    
    else {
      req.flash("notice", `Sorry, the Inventory item ${inv_make} ${inv_model} could not be added.`);
      console.log(req.body);
    };

    const classificationList = await utilities.buildClassificationList(classification_id);  
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classificationList,
      errors: null
    })

  } catch (error) {

    console.error(error);
    req.flash("notice", "There was an error processing your request.");
    res.redirect("/");
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {

  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0].inv_id) {
    return res.json(invData)
  } 
  else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the edit inventory view
 * ************************** */
invCont.editItemInformation = async (req, res, next) => {

  const inventory_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inventory_id);
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });

}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } 
  
  else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Deleting Data view
 * ************************** */
invCont.buildDeletingView = async function (req, res, next) {

  const inventory_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inventory_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });

}

/* ***************************
 *  Delete Inventory Item Process
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {

  let nav = await utilities.getNav()
  const inventory_id = parseInt(req.params.inventoryId);

  const { inv_id } = req.body
  
  const deleteResult = await invModel.deleteInventory(inv_id)
  console.log("Inventory ID: " + inv_id)

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } 
  
  else {
    const itemData = await invModel.getVehicleById(inventory_id);
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
    })
  }
}


module.exports = invCont