const express = require('express');
const router = express.Router();
const controller = require('../controllers/loginAPIController');

router.use(controller.preventPage);

//register first step form
router.get('/', controller.register, (req, res) => {

    res.render('register');
})

//register second step password form route for refresh
router.get('/password', controller.passwordGet, (req, res) => {

    res.render('password');
})

//register second step password form
router.post('/password', controller.password, (req, res) => {

    res.render('password');
})

//mail check route to to check mail exist in db
router.post('/mailCheck', controller.mailCheck)

//all register steps completed successfully
router.post('/createUser', controller.createUser)

module.exports = router;
