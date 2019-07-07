var express = require('express');
const session = require('express-session')
var _ = require('lodash')
var { User } = require('../models/user');
var { Todo } = require('../models/todo')
var { authenticate } = require('../middleware/authenticate');
var router = express.Router();
const products = require('../public/db/products')

router.get('/', function (req, res) {
    if (req.session.xauth) {
        let token = req.session.xauth
        // console.log(token);
        res.render('shop.hbs', {
            products1: products.products1,
            products2: products.products2,
        })
    } else {
        res.redirect('/login')
    }
})

module.exports = router;