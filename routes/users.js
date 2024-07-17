const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controller/users.js');
const { savedRedirectUrl } = require("../middleware.js");

router.route('/signup')
    .get(usersController.renderSignupForm)
    .post(usersController.signupUser);

router.route('/login')
    .get(usersController.renderLoginForm)
    .post(savedRedirectUrl, passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), usersController.loginUser);

router.get('/logout', usersController.logoutUser);
module.exports = router;
