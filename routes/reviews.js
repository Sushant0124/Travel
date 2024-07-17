const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewsController = require("../controller/reviews.js");
const { isloggedin, isReviewAuthor } = require("../middleware.js");

router.post("/", isloggedin, reviewsController.validatereview, reviewsController.createReview);
router.delete("/:reviewsId", isReviewAuthor, reviewsController.deleteReview);

module.exports = router;
