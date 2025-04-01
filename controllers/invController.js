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

module.exports = invCont