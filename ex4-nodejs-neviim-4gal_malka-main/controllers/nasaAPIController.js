const db = require("../models");

module.exports.isPhotoExists = async function (req, res,next) {

    try {
        //check if delete all photos or one photo
        let options = Object.keys(req.body).length === 0 ? {email: req.session.user.email} :
            {email: req.session.user.email, photoID: req.body.photoID};

        const result = await db["Picture"].findAll({where: options, raw: true});//all saved photos found

        //send failure in ajax
        if (req.method === 'PUT' && result.length !== 0 || req.method === 'DELETE' && result.length === 0) {
            return res.send(false);
        }
        else return next();
    } catch (err) {
        return res.status(500).end();//db failure
    }
}



module.exports.preventPage = function (req, res, next) {

    if (!req.session.logged) {
        return res.status(401).end();
    }

    next();

}