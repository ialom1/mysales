var { User } = require('./../models/user');

var validateAuth = (req, res, next) => {
    var token = req.session.xauth;

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = { validateAuth };
