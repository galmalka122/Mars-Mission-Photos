const db = require('../models');

/**
 * defines the render options by session details
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports.renderOptionCreate = async function (req, res, next) {

    try {

        res.locals.title = 'Home';

        /*if user is logged in load the search page with saved data*/
        if (req.session.logged) {
            res.locals.unauthorized = req.session.unauthorized;//
            delete req.session.unauthorized;
            res.locals.savedPhotos = await db["Picture"].findAll({where: {email: req.session.user.email}, raw: true});
            res.locals.script = `<script type="module" src="/js/homeManager.js"></script>`;
            res.locals.curUser = req.session.user.email;
            res.locals.fullName = `${req.session.user.firstName} ${req.session.user.lastName}`
            return next();

        }
        next();
    }
    //if error occurred in db
    catch (err) {
        res.locals.unauthorized = {message: 'server internal error',url: '/login'};
        req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }

}