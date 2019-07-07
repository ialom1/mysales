var express = require('express');
const session = require('express-session')
var _ = require('lodash')
var { User } = require('../models/user');
var { authenticate } = require('../middleware/authenticate');
var router = express.Router();

// Home page route.
router.get('/', (req, res) => {
  if (req.session.xauth) {
    res.redirect('/shop')
  } else {
    res.render('login.hbs')
  }
})

router.post('/', function (req, res) {

  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return user.generateAuthToken().then((token) => {
      req.session.xauth = token
      res.redirect('/shop');
    })
  }).catch((e) => {
    res.status(400).send()
  })

})

module.exports = router;