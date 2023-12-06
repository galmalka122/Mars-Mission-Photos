const db = require('../models');

/**
 * Middleware function to define render options based on session details for the create option route.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 */
module.exports.renderOptionCreate = async function (req, res, next) {
    try {
        // Setting the title in the local variables for rendering
        res.locals.title = 'Home';

        // Checking if the user is logged in
        if (req.session.logged) {
            // Loading the search page with saved data if the user is logged in
            res.locals.unauthorized = req.session.unauthorized; // Assigning unauthorized session data if available
            delete req.session.unauthorized; // Removing unauthorized session data
            res.locals.savedPhotos = await db["Picture"].findAll({
                where: { email: req.session.user.email },
                raw: true
            }); // Fetching saved photos for the logged-in user
            res.locals.script = `<script type="module" src="/js/homeManager.js"></script>`; // Including a script in the page
            res.locals.curUser = req.session.user.email; // Assigning current user's email to local variables
            res.locals.fullName = `${req.session.user.firstName} ${req.session.user.lastName}`; // Assigning full name of the user to local variables

            // Proceeding to the next middleware
            return next();
        }

        // If the user is not logged in, proceed to the next middleware
        next();
    } catch (err) {
        // Handling errors that occurred during the database operation
        res.locals.unauthorized = { message: 'server internal error', url: '/login' };
        req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }
};
