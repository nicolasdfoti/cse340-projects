const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {

  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by item detail view
 * ************************** */
invCont.getInventoryItem = async function (req, res, next) {

  try {
    const inventory_id = req.params.inventoryId;
    const vehicleData = await invModel.getVehicleById(inventory_id);

    if (!vehicleData) {
      let error = new Error(`Vehicle not found`);
      error.status = 404;
      throw error;
    }

    const vehicleDetail = await utilities.buildVehicleDetail(vehicleData);
    let nav = await utilities.getNav();

    res.render("inventory/detailedView", { 
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
      nav,
      vehicleDetail,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = invCont