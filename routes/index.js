express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController')

// Route for the home page (serves as the landing page)
// If the user is logged in, the search engine appears; otherwise, there's a short intro
router.get('/', controller.renderOptionCreate, function (req, res) {
    // Rendering the 'index' HTML file
    res.render('index');
});

// Exporting the router object to make it available for use in other files
module.exports = router;