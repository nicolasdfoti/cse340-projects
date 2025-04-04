const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {

  let nav = await utilities.getNav()

  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })

}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {

    let nav = await utilities.getNav()

    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null
    })

}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {

  let nav = await utilities.getNav()

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })

}

/* ****************************************
*  Deliver update account information view
* *************************************** */
async function buildUpdateAccount(req, res, next) {

  let nav = await utilities.getNav()
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountByID(account_id);

  res.render("account/update-account", {
    title: "Update Account Information",
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_password: accountData.account_password,
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(account_password, salt);
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, ${account_firstname}! You\'re registered. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } 
    
    else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {

  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {

    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      return res.redirect("account-management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Update Info
* *************************************** */
async function updateAccount(req, res, next) {
  
  let nav = await utilities.getNav()
  const formType = req.body.form_type;
  const account_id = req.body.account_id;

  if (formType === "info") {

    const { account_firstname, account_lastname, account_email } = req.body;
  
    const updateResult = await accountModel.updateData(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )
        
    if (updateResult) {
      const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
      req.flash("notice", `The ${accountName} account was successfully updated.`)
      res.redirect("account-management")
    } 
      
    else {
      const accountName = `${account_firstname} ${account_lastname}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("/update-account", {
      title: "Update " + accountName + " account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
      })
    }
  }

  else if (formType === "password") {

    const { account_password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(account_password, salt);

    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
      req.flash("notice", `The password was successfully updated.`)
      res.redirect("account-management")
    } 

    else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("/update-account", {
      title: "Update account",
      nav,
      account_id
      })
    }
  }
}

/* ****************************************
*  Logout Process
* *************************************** */
async function accountLogout (req, res, next) {

  res.clearCookie("jwt");
  req.sessionId = null;
  res.redirect("/");
}

/* ****************************************
*  Build Delete Account View
* *************************************** */
async function buildDeleteAccountView (req, res, next) {

  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountByID(account_id);
  const accountName = accountData.account_firstname + " " + accountData.account_lastname;

  res.render("account/delete-account", {
    title: "Delete " + accountName,
    nav,
    errors: null,
    account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_password: accountData.account_password
  });

}


/* ****************************************
*  Delete Account Process
* *************************************** */
async function deleteAccount (req, res, next) {

  let nav = await utilities.getNav();
  const account_id = req.body.account_id;

  const accountData = await accountModel.getAccountByID(account_id);

  try {
    const deleteResult = await accountModel.deleteAccount(account_id);

    if (deleteResult) {
      const accountName = accountData.account_firstname + " " + accountData.account_lastname;
      req.flash("notice", `The ${accountName} account has been deleted`);

      res.clearCookie("jwt");
      req.session.destroy();
      
      res.redirect("/");
    }

    else {
      const accountName = accountData.account_firstname + " " + accountData.account_lastname;
      req.flash("notice", `The process failed! Please try again`);
      res.status(501).render("account/delete-account", {
        nav,
        errors: null,
        title: "Delete " + accountName,
        account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_password: accountData.account_password
      });
      
    }

  } catch(error) {
    console.error(error);
  }

}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount, accountLogout, buildDeleteAccountView, deleteAccount };