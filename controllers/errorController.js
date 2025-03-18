const errorCont = {}

/* ***************************
 *  Create the intentional error
 * ************************** */
errorCont.triggerError = async function (req, res, next) {

    try {
        const error = new Error("Intentional 500 error!")
        error.status = 500
        next(error);
    } catch (err) {
        next(err);
    }
}

module.exports = errorCont;