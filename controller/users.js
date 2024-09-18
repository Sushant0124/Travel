const User = require('../models/users');
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsync');

const renderSignupForm = (req, res) => {
    res.render('users/signup');
};

const signupUser = wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        console.log('Received data:', req.body); // Debug: log the received data
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to WanderWorld');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
});

const renderLoginForm = (req, res) => {
    res.render('users/login');
};

const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

const logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You are logged out!');
        res.redirect('/listings');
    });
};



const guestUser = wrapAsync(async (req, res, next) => {
    try {
        const guestUsername = `Guest_${Date.now()}`;
        const guestEmail = `${guestUsername}@guest.com`;
        const guestPassword = Math.random().toString(36).slice(-8);

        const newUser = new User({
            username: guestUsername,
            email: guestEmail,
            // isGuest: true
        });

        const registeredUser = await User.register(newUser, guestPassword);

        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'Logged in as a guest user');
            res.redirect('/listings');
        });
    } catch (e) {
        console.error('Error creating guest user:', e);
        req.flash('error', 'Unable to create guest user');
        res.redirect('/login');
    }
});


module.exports = {
    renderSignupForm,
    signupUser,
    renderLoginForm,
    loginUser,
    logoutUser,
    
    guestUser
};
