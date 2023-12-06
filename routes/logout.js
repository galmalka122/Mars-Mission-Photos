const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

router.use(controller.preventPage);

// Route for handling logout requests (POST method)
router.post('/', (req, res) => {
    // Destroying the session and redirecting to the home page
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Exporting the router object to make it available for use in other files
module.exports = router;