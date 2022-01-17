express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController')

//the home page(uses as landing page. if user logged in then search engine appears, else theres a short intro).
router.get('/',controller.renderOptionCreate,function (req, res) {

    res.render('index');//render the html
});

module.exports = router;
