const db = require("../models");

/**
 * Middleware function to set rendering options for login and registration pages.
 * Deletes session indicators after arranging rendering options.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.renderOptions = function (req, res, next) {
    // Arrange rendering options and delete session indicators
    res.locals.title = 'Login';
    res.locals.script = `<script type="module" src="/js/loginManager.js"></script>`;
    if (typeof req.session.curEmail !== 'undefined' && req.session.curEmail !== '')
        res.locals.curEmail = `value=${req.session.curEmail}`;
    res.locals.mailErr = req.session.mailErr;
    res.locals.passErr = req.session.passErr;
    res.locals.unauthorized = req.session.unauthorized;
    res.locals.created = req.session.created;
    delete req.session.unauthorized;
    delete req.session.created;
    delete req.session.mailErr;
    delete req.session.passErr;
    delete req.session.curEmail;
    return next();
};

/**
 * Middleware function to authenticate a user during login.
 * Redirects to appropriate pages based on login success or failure.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
module.exports.authenticateUser = async (req, res) => {
    try {
        req.session.curEmail = req.body["loginEmail"];
        // Check if the email is registered in the database
        const result = await db["User"].findOne({ where: { email: req.body["loginEmail"] }, raw: true });

        if (!result) {
            req.session.mailErr = `Email doesn't exist. Please enter a registered email`;
            return res.redirect('/login');
        } else if (req.body["loginPassword"] !== result.password) {
            req.session.passErr = `Password incorrect. Please try again`;
            return res.redirect('/');
        } else {
            // Log the user in
            const { ['password']: deletedKey, ...resultWithoutPass } = result;
            req.session.user = resultWithoutPass;
            req.session.logged = true;
            return res.redirect('/');
        }
    } catch (err) {
        res.locals.unauthorized = { message: 'server internal error', url: '/login' };
        return req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }
};

/**
 * Middleware function to set rendering options for the registration page.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.register = function (req, res, next) {
    // Register page rendering options
    if (req.cookies['passwordTimer']) {
        res.clearCookie("passwordTimer");
    }
    res.locals.title = 'Register';
    res.locals.mailErr = req.session.mailErr;
    delete req.session.mailErr;
    res.locals.script = `<script type="module" src="/js/registerManager.js"></script>`;
    return next();
};

/**
 * Middleware function to set rendering options for the password page.
 * Sets a timer cookie for page refreshing protection.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.password = function (req, res, next) {
    // Protect from refreshing page + set the timer cookie
    res.locals.title = 'Password';
    res.locals.script = `<script type="module" src="/js/passwordManager.js"></script>`;
    res.setHeader('referer', req.get('origin') + '/register/password');
    let a = new Date();
    a.setSeconds(a.getSeconds() + 60);
    res.cookie('passwordTimer', a.getTime(), { maxAge: 60 * 1000 });
    req.session.user = req.body;
    return next();
};

/**
 * Middleware function to set rendering options for the password page in a GET request.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.passwordGet = function (req, res, next) {
    // Check for cookie (GET request)
    res.locals.title = 'Password';
    res.locals.script = `<script type="module" src="/js/passwordManager.js"></script>`;
    return next();
};

/**
 * Middleware function to handle redirection after successful user registration.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
module.exports.onSuccess = function (req, res) {
    if (!req.session.created) {
        return res.redirect('/register');
    }
    return res.redirect('/login');
};

/**
 * Middleware function to create a new user in the database after registration.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
module.exports.createUser = async function (req, res) {
    try {
        if (!req.session.user) return res.redirect('/register');
        res.clearCookie('passwordTimer');
        const result = await db["User"].findAll({ where: { email: req.session.user.email }, row: true });

        if (result.length !== 0) {
            req.session.mailErr = `Email already in use`;
            return res.redirect('/register');
        }

        let userData = req.session.user;
        userData.password = req.body.password;
        const user = await db["User"].create(userData);
        const { ['password']: deletedKey, ...resultWithoutPass } = user.dataValues;
        req.session.user = resultWithoutPass;
        req.session.created = true;
        return res.redirect('/login');
    } catch (err) {
        res.locals.unauthorized = { message: 'server internal error', url: '/register' };
        return req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }
};

/**
 * Middleware function to check if an email exists in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
module.exports.mailCheck = async function (req, res) {
    // Check if mail exists on the database
    let mail = req.query.email;

    try {
        const result = await db["User"].findOne({ where: { email: mail }, raw: true });
        // Return answer in JSON
        return res.json({
            isValid: !result,
            message: 'Email in use'
        });
    } catch (err) {
        return res.status(404).end(); // Database failure
    }
};

/**
 * Middleware function to prevent access to protected pages for logged-in users and non-logged-in users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports.preventPage = async function (req, res, next) {
    // Prevent user from accessing protected pages
    if ((req.session.logged && req.baseUrl !== '/logout') ||
        (!req.session.logged && req.url === '/logout')) {
        res.locals.unauthorized = { message: 'You are already logged in.', url: '/' };
        return res.redirect(`/`);
    }

    next();
};
