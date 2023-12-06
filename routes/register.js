const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

router.use(controller.preventPage);

// Route for the first step of the registration form (GET method)
router.get('/', controller.register, (req, res) => {
    res.render('register');  // Render the 'register' view
});

// Route for the password form in case of a refresh (GET method)
router.get('/password', controller.passwordGet, (req, res) => {
    res.render('password');  // Render the 'password' view
});

// Route for the second step of the registration form (POST method)
router.post('/password', controller.password, (req, res) => {
    res.render('password');  // Render the 'password' view
});

// Route for checking if an email exists in the database (POST method)
router.post('/mailCheck', controller.mailCheck);

// Route for completing all registration steps successfully (POST method)
router.post('/createUser', controller.createUser);

// Exporting the router object to make it available for use in other files
module.exports = router;
