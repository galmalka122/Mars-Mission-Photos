const express = require('express');
const router = express.Router();
const db = require('../models');
const controller = require('../controllers/nasaAPIController');

router.use(controller.preventPage);

// Route for getting all saved photos (GET method)
router.get('/getPhotos', async (req, res) => {
    try {
        // Get user's saved photos from the database
        const result = await db["Picture"].findAll({ where: { email: req.session.user.email }, raw: true });
        return res.json(result);  // Return the photos as JSON
    } catch (err) {
        return res.status(500).end();  // Return 500 status for database failure
    }
});

// Route for adding a photo to saved photos (PUT method)
router.put('/addPhoto', controller.isPhotoExists, async (req, res) => {
    try {
        const photo = req.body;  // The photo's details to store in the database
        photo.email = req.session.user.email;  // Set the user's email
        const result = await db["Picture"].create(photo);  // Add the photo to the database
        return res.json(result);  // Return the photo data as JSON
    } catch (err) {
        return res.status(500).end();  // Return 500 status for database failure
    }
});

// Route for deleting one/all saved photos (DELETE method)
router.delete('/deletePhoto', controller.isPhotoExists, async (req, res) => {
    try {
        // Check if deleting all photos or one photo based on the request body
        let options = Object.keys(req.body).length === 0 ? { email: req.session.user.email } :
            { email: req.session.user.email, photoID: req.body.photoID };
        
        await db["Picture"].destroy({ where: options });  // Delete photos from the database
        res.end();  // End the response
    } catch (err) {
        return res.status(500).end();  // Return 500 status for database failure
    }
});

// Exporting the router object to make it available for use in other files
module.exports = router;