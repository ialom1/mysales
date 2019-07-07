var express = require('express');
const session = require('express-session')
var _ = require('lodash')
var { User } = require('../models/user');
var { authenticate } = require('../middleware/authenticate');
var { validateAuth } = require('../middleware/validateAuth');
var router = express.Router();

// Home page route.
router.get('/', validateAuth, function (req, res) {
  req.user.removeToken(req.token).then(() => {
    req.session.destroy()
    res.status(200).redirect('/login');
  }, () => {
    res.status(400).send();
  });
})

module.exports = router;