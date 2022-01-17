const db = require("../models");

module.exports.renderOptions = function (req, res, next) {

    //arrange all rendering options and delete session indicators
    res.locals.title = 'Login';
    res.locals.script = `<script type="module" src="/js/loginManager.js"></script>`;
    if (typeof req.session.curEmail !== 'undefined' && req.session.curEmail !== '')
        res.locals.curEmail = `value=${req.session.curEmail}`;
    res.locals.mailErr = req.session.mailErr;
    res.locals.passErr = req.session.passErr;
    res.locals.unauthorized = req.session.unauthorized;
    res.locals.created = req.session.created;
    delete req.session.unauthorized;
    delete req.session.created;
    delete req.session.mailErr;
    delete req.session.passErr;
    delete req.session.curEmail;
    return next();
}

module.exports.authenticateUser = async (req, res,) => {

    try {
        req.session.curEmail = req.body["loginEmail"];
        //check if mail registered on db
        const result = await db["User"].findOne({where: {email: req.body["loginEmail"]}, raw: true});
        if (!result) {
            req.session.mailErr = `Email doesn't exist. Please enter a registered email`;
            return res.redirect('/login');

            //check if password matches mail account
        } else if (req.body["loginPassword"] !== result.password) {
            req.session.passErr = `Password incorrect. Please try again`;
            return res.redirect('/');
            //log the user in
        } else {
            const {['password']: deletedKey, ...resultWithoutPass} = result;
            req.session.user = resultWithoutPass;
            req.session.logged = true;
            return res.redirect('/');
        }
    } catch (err) {
        res.locals.unauthorized = {message: 'server internal error',url: '/login'};//db failure
        return req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }
}


module.exports.register = function (req, res, next) {
    //register page rendering options
    if (req.cookies['passwordTimer']) {
        res.clearCookie("passwordTimer");
    }
    res.locals.title = 'Register';
    res.locals.mailErr = req.session.mailErr;
    delete req.session.mailErr;
    res.locals.script = `<script type="module" src="/js/registerManager.js"></script>`;
    return next();
}

module.exports.password = function (req, res, next) {

    //protect from refreshing page + set the timer cookie
    res.locals.title = 'Password';
    res.locals.script = `<script type="module" src="/js/passwordManager.js"></script>`;
    res.setHeader('referer', req.get('origin') + '/register/password');
    let a = new Date();
    a.setSeconds(a.getSeconds() + 60);
    res.cookie('passwordTimer', a.getTime(), {maxAge: 60 * 1000, secure: true});
    req.session.user = req.body;
    return next();

}

module.exports.passwordGet = function (req, res, next) {

    //check for cookie (get request)
    res.locals.title = 'Password';
    res.locals.script = `<script type="module" src="/js/passwordManager.js"></script>`;
    return next();

}

module.exports.onSuccess = function (req, res) {

    if (!req.session.created) {
        return res.redirect('/register');
    }
    return res.redirect('/login');
}

module.exports.createUser = async function(req,res){

    try {
        if(!req.session.user) return res.redirect('/register');
        res.clearCookie('passwordTimer');
        const result = await db["User"].findAll({where: {email: req.session.user.email}, row: true});
        if (result.length !== 0) {
            req.session.mailErr = `Email already in use`;
            return res.redirect('/register');
        }
        let userData = req.session.user;
        userData.password = req.body.password;
        const user = await db["User"].create(userData);
        const {['password']: deletedKey, ...resultWithoutPass} = user.dataValues;
        req.session.user = resultWithoutPass;
        req.session.created = true;
        return res.redirect('/login');
    } catch (err) {
        res.locals.unauthorized = {message: 'server internal error',url: '/register'};
        return req.session.destroy(res.status(500).render(`./partials/unauthorized`));
    }
}

module.exports.mailCheck = async function (req,res){

    //check if mail exists on db
    let mail = req.query.email;
    try {
        const result = await db["User"].findOne({where: {email: mail}, raw: true});//find mail on db
        //return answer in json
        return res.json({
            isValid: !result,
            message: 'Email in use'
        })
    } catch (err) {
        return res.status(404).end();//db failure
    }
}

module.exports.preventPage = async function(req, res, next) {

    //prevent user to access protected pages
    if (req.session.logged && req.baseUrl !== '/logout' ||
        !req.session.logged && req.url === '/logout' ) {
        res.locals.unauthorized = {message: 'You are already logged in.',url:'/'};
        return res.redirect(`/register`);
    }

    next();

}
