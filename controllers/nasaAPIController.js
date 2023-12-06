const db = require("../models");

/**
 * Middleware function to check if a photo exists in the database.
 * Determines whether to delete all photos or a specific photo based on the request body.
 * Sends a failure response in the case of an AJAX request if the conditions are not met.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.isPhotoExists = async function (req, res, next) {
    try {
        // Check if deleting all photos or one photo
        let options = Object.keys(req.body).length === 0 ? { email: req.session.user.email } :
            { email: req.session.user.email, photoID: req.body.photoID };

        // Find all saved photos based on the options
        const result = await db["Picture"].findAll({ where: options, raw: true });

        // Send failure in AJAX
        if ((req.method === 'PUT' && result.length !== 0) || (req.method === 'DELETE' && result.length === 0)) {
            return res.send(false);
        } else {
            // Continue to the next middleware if conditions are met
            return next();
        }
    } catch (err) {
        return res.status(500).end(); // Database failure
    }
};

/**
 * Middleware function to prevent access to a page if the user is not logged in.
 * Sends a 401 Unauthorized status if the user is not logged in.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.preventPage = function (req, res, next) {
    // Check if the user is not logged in and send 401 Unauthorized status
    if (!req.session.logged) {
        return res.status(401).end();
    }

    // Continue to the next middleware if the user is logged in
    next();
};
