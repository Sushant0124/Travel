const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");

const wrapAsync = require("../utils/wrapAsync.js");

const validatereview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        console.log(result.error);
        throw new ExpressError(400, "Bad Request");
    } else {
        next();
    }
};

const createReview = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    list.review.push(newReview);
    await newReview.save();
    await list.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${list._id}`);
});

const deleteReview = wrapAsync(async (req, res) => {
    let { id, reviewsId } = req.params;
    await Review.findByIdAndDelete(reviewsId);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewsId } });
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
});

module.exports = {
    validatereview,
    createReview,
    deleteReview
};
