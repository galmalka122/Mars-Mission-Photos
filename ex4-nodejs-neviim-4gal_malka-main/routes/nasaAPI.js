const express = require('express');
const router = express.Router();
const db = require('../models');
const controller = require('../controllers/nasaAPIController');

router.use(controller.preventPage);

//get all saved photo
router.get('/getPhotos',async (req, res) => {

    try {
        //get user's saved photo
        const result = await db["Picture"].findAll({where: {email: req.session.user.email}, raw: true})
        return res.json(result);//return as json
    } catch (err) {
        return res.status(500).end();//db failure
    }
});

//add photo to saved photo
router.put('/addPhoto', controller.isPhotoExists, async (req, res) => {

    try {
        const photo = req.body;//the photo's details to store in db
        photo.email = req.session.user.email;//the user's mail
        const result = await db["Picture"].create(photo);//add to db
        return res.json(result);//return the photo data
    } catch (err) {
        return res.status(500).end();//db failure
    }

});

//delete one/all saved photos
router.delete('/deletePhoto', controller.isPhotoExists, async (req, res) => {

    try {
        //check if delete all photos or one photo
        let options = Object.keys(req.body).length === 0 ? {email: req.session.user.email} :
            {email: req.session.user.email, photoID: req.body.photoID};
        await db["Picture"].destroy({where: options});//delete
        res.end()
    } catch (err) {
        return res.status(500).end();//db failure
    }
});

module.exports = router;