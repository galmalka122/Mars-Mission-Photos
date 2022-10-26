const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

router.use(controller.preventPage);

//logout request
router.post('/', (req, res) => {

    req.session.destroy(()=>{res.redirect('/')});//remove session and redirect to home page

})

module.exports = router;