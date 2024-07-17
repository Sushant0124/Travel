const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../schema.js");
const mbxGeocodimg = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_KEY;
const   geocodingClient = mbxGeocodimg({ accessToken: mapToken });

const wrapAsync = require("../utils/wrapAsync.js");

const getAllListings = wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    console.log("Collect all listings");
    res.render("listing/index.ejs", { listings });
});

const renderNewListingForm = (req, res) => {
    res.render("listing/new.ejs");
};

const createNewListing = wrapAsync(async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send();

  
       
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let saved=await newListing.save();
    console.log(saved);
    req.flash("success", "New List Created!");
    res.redirect("/listings");
});

const renderEditListingForm = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error","Your current request doesnt exist");
        return res.redirect("/listings");
        };
        let orignalUrl=list.image.url;
        orignalUrl=orignalUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listing/edit.ejs", { list,orignalUrl });
});

const updateListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newlisting=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file!=="undefined"){
        console.log(req.file);
        let url=req.file.path;
    let filename=req.file.filename;
        newlisting.image={url,filename};
        await newlisting.save();
    }
   
    req.flash("success", "List Updated!");
    res.redirect(`/listings/${id}`);
});

const deleteListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
});

const showListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" },
        })
        .populate("owner");
    res.render("listing/show.ejs", { list });
});

const validatelisting = (req, res, next) => {
    let result = listingSchema.validate(req.body.listing.message);
    if (result.error) {
        console.log(result.error);
        throw new ExpressError(400, "Bad Request");
    } else {
        next();
    }
};

module.exports = {
    getAllListings,
    renderNewListingForm,
    createNewListing,
    renderEditListingForm,
    updateListing,
    deleteListing,
    showListing,
    validatelisting
};
