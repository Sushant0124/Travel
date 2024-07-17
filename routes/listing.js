const express = require("express");
const router = express.Router();
const listingController = require("../controller/listing.js");
const { isloggedin, isOwner } = require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
    .get(listingController.getAllListings)
     .post(isloggedin,upload.single('listing[image]'), listingController.validatelisting, listingController.createNewListing);
    

router.route("/new")
    .get(isloggedin, listingController.renderNewListingForm);

router.route("/:id")
    .get(listingController.showListing)
    .put(isloggedin, isOwner,upload.single('listing[image]'), listingController.validatelisting, listingController.updateListing)
    .delete(isloggedin, isOwner, listingController.deleteListing);

router.route("/:id/edit")
    .get(isloggedin, isOwner, listingController.renderEditListingForm);

module.exports = router;
