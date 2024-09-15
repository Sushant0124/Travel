if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

const listing = require("./routes/listing.js");
const review = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const razopay=require("./routes/razopay.js")

const mong_url = process.env.MONGO_URL ;

async function main() {
    try {
        await mongoose.connect(mong_url); // No need for deprecated options
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
    }
}

main();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require('method-override');
const wrapAsync = require("./utils/wrapAsync.js");
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsmate);

const store = MongoStore.create({
    mongoUrl: mong_url,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
    console.log("Session store error", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", review);
app.use("/", userRoutes);
app.use("/",razopay);
// In your Express server file (e.g., server.js or app.js)
app.get('/config', (req, res) => {
    console.log(process.env.RAZORPAY_KEY_ID);
    res.json({
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
});


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});