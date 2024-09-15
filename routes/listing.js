const express = require("express");
const router = express.Router();
const listingController = require("../controller/listing.js");
const { isloggedin, isOwner } = require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });

// Place specific routes before parameterized routes
router.get("/search", listingController.search);
router.get("/new", isloggedin, listingController.renderNewListingForm);

router.route("/")
    .get(listingController.getAllListings)
    .post(isloggedin, upload.single('listing[image]'), listingController.validatelisting, listingController.createNewListing);

router.get("/filter/:id", isloggedin, listingController.filter);

// Place parameterized routes last
router.route("/:id")
    .get(listingController.showListing)
    .put(isloggedin, isOwner, upload.single('listing[image]'), listingController.validatelisting, listingController.updateListing)
    .delete(isloggedin, isOwner, listingController.deleteListing);

router.get("/:id/edit", isloggedin, isOwner, listingController.renderEditListingForm);

module.exports = router;