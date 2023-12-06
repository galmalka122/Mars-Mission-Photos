const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

// Route for displaying the login form
router.get('/', controller.preventPage, controller.renderOptions, (req, res) => {
   // Rendering the 'login' HTML file
   res.render('login');
});

// Route for handling login requests (POST method)
router.post('/', controller.authenticateUser);

// Exporting the router object to make it available for use in other files
module.exports = router;