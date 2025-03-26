const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid name."), // on error this message is sent.
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {

    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()

      res.render("inventory/add-classification", {
        errors,
        title: "Classification",
        nav,
        classification_name
      })
      return
    }
    next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
      body("inv_make")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a valid item name."),
      
      body("inv_model")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a valid model."),

      body("inv_year")
          .trim()
          .isInt({ min: 1900, max: new Date().getFullYear() })
          .withMessage(`Please enter a valid year between 1900 and ${new Date().getFullYear()}.`),

      body("inv_description")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a description."),

      body("inv_image")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide an image path."),

      body("inv_thumbnail")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a thumbnail path."),

      body("inv_price")
          .trim()
          .isFloat({ min: 0 })
          .withMessage("Please enter a valid price."),

      body("inv_miles")
          .trim()
          .isInt({ min: 0 })
          .withMessage("Please enter a valid mileage."),

      body("inv_color")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please provide a color."),

      body("classification_id")
          .trim()
          .isInt({ min: 1 })
          .withMessage("Please select a valid classification.")
  ]
}

/* ******************************
 * Check data and return errors or continue to submission
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)

      res.render("inventory/add-inventory", {
          errors,
          title: "Add Inventory Item",
          nav,
          classificationList,
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
      return
  }
  next()
}


  
module.exports = validate