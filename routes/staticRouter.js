const express = require("express");

const router = express.Router();


router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register'
    });

 });

 router.get('/login', function (req, res) {

    res.render('login', {
        title: 'Login'
    });

});

module.exports = router;