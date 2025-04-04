const pool = require("../database/index.js");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){

    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

    } catch (error) {

      return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using Account ID
* ***************************** */
async function getAccountByID (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching ID found")
  }
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateData (account_firstname, account_lastname, account_email, account_id) {

  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";

    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])

    return data.rows[0]

  } catch (error) {
    console.error("model error: " + error)
  }
}

async function updatePassword (account_password, account_id) {

  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";

    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0]

  } catch(error) {
    console.error("model error: " + error);
  }

}

module.exports = {registerAccount, getAccountByEmail, getAccountByID, updateData, updatePassword};