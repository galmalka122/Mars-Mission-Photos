const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

//login form
router.get('/',controller.preventPage,controller.renderOptions,(req,res)=>{
   res.render('login');
})

//login request
router.post('/',controller.authenticateUser)

module.exports = router;