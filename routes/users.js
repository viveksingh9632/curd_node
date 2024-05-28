// var express = require('express');
// var router = express.Router();
// var User = require('../models/user');
// const bcrypt = require('bcryptjs');

// router.get('/register', function (req, res) {

//     res.render('register', {
//         title: 'Register'
//     });

// });




// router.post('/register', async (req, res) => {
//     const { email, password, confirmpassword } = req.body;

//     // Check if password and confirm password match
//     if (password !== confirmpassword) {
//         return res.status(400).json({ msg: 'Passwords do not match' });
//     }

//     try {
//         // Check if user exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         // Create new user object
//         user = new User({
//             email,
//             password
//         });

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         // Save user
//         await user.save();

//         res.status(201).json({ msg: 'User registered successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });




// module.exports = router;



// routes/user.js
const express = require("express");
const { handleUserRegister,handleUserLogin  } = require("../controllers/user");

const router = express.Router();

router.post("/register", handleUserRegister);

router.post("/login", handleUserLogin);


module.exports = router;
